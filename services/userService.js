import UserRepository from '../repository/userRepo.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';

const userRepo = new UserRepository();

class UserService {
    async register(userData) {
        const existing = await userRepo.getUserByEmail(userData.email);
        if (existing) throw new Error('Email already registered');
        userData.password = await hashPassword(userData.password);
        const user = await userRepo.createUser(userData);
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        return { accessToken, refreshToken, user };
    }

    async login(email, password) {
        const user = await userRepo.getUserByEmail(email);
        if (!user) throw new Error('Invalid credentials');
        if (user.isBlocked) throw new Error('User is blocked');
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) throw new Error('Invalid credentials');
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        return { user, accessToken, refreshToken };
    }

    async refresh(refreshToken) {
        const { id } = require('../utils/jwt.js').verifyRefreshToken(refreshToken);
        const user = await userRepo.getUserById(id);
        if (!user) throw new Error('User not found');
        const accessToken = generateAccessToken(user);
        return { accessToken };
    }

    async getProfile(userId) {
        return await userRepo.getUserById(userId);
    }

    async updateProfile(userId, updateData) {
        const user = await userRepo.getUserById(userId);
        if (!user) throw new Error('User not found');
        if (user.isBlocked) throw new Error('User is blocked');

        // Prevent role update unless user is admin
        if ('role' in updateData && user.role !== 'admin') {
            delete updateData.role;
            throw new Error('Only admin can update user roles');
        }
        if (updateData.password) {
            updateData.password = await hashPassword(updateData.password);
        }
        return await userRepo.updateUser(userId, updateData);
    }

    async blockUser(userId) {
        return await userRepo.blockUser(userId);
    }

    async unblockUser(userId) {
        return await userRepo.unblockUser(userId);
    }

    async getAllUsers(filter) {
        return await userRepo.getAllUsers(filter);
    }

    async deleteUser(userId) {
        return await userRepo.deleteUser(userId);
    }

    async updateUserRole(userId, role) {
        const user = await userRepo.getUserById(userId);
        if (!user) throw new Error('User not found');
        user.role = role;
        await user.save();
        return user;
    }
}

export default UserService;