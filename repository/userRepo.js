import User from '../models/User.js';

class UserRepository {
    async createUser(userData) {
        const user = new User(userData);
        return await user.save();
    }

    async getAllUsers() {
        return await User.find();
    }

    async getUserById(userId) {
        return await User.findById(userId);
    }

    async getUserByEmail(email) {
        return await User.findOne({ email });
    }

    async getUserByUsername(username) {
        return await User.findOne({ username });
    }

    async updateUser(userId, updateData) {
        return await User.findByIdAndUpdate(userId, updateData, { new: true });
    }

    async deleteUser(userId) {
        return await User.findByIdAndDelete(userId);
    }

    async existsByEmailorUsername(email, username) {
        return await User.exists({ $or: [{ email }, { username }] });
    }

    async blockUser(userId) {
        return await User.findByIdAndUpdate(userId, { isBlocked: true }, { new: true });
    }

    async unblockUser(userId) {
        return await User.findByIdAndUpdate(userId, { isBlocked: false }, { new: true });
    }
}

export default UserRepository;