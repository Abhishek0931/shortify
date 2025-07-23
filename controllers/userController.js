import UserService from '../services/userService.js';
import { generateOTP, otpExpiry } from '../utils/otp.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import { sendOTPEmail } from '../utils/mailer.js';
import { hashPassword } from '../utils/password.js';
import User from '../models/User.js';

const userService = new UserService();

export const register = async (req, res) => {
    try {
        const userData = { ...req.body };
        if (req.file) {
            userData.profilePic = req.file.path; // Assuming the file path is stored in req.file.path
        }
        const result = await userService.register(userData);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const result = await userService.login(req.body.email, req.body.password);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const requestOtpLogin = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.isBlocked) return res.status(403).json({ message: 'User is blocked' });

        const otp = generateOTP();
        user.otp = { code: otp, expiresAt: otpExpiry() };
        await user.save();

        await sendOTPEmail(email, otp);
        res.json({ message: 'OTP sent to your email.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const loginWithOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.isBlocked) return res.status(403).json({ message: 'User is blocked' });

        if (
            !user.otp ||
            user.otp.code !== otp ||
            !user.otp.expiresAt ||
            user.otp.expiresAt < new Date()
        ) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Clear OTP after successful login
        user.otp = undefined;
        await user.save();

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        res.json({ user, accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Request OTP for password reset
export const requestPasswordResetOtp = async (req, res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.isBlocked) return res.stratus(403).json({ message: 'User is bloked'});

        const otp = generateOTP();
        user.otp = { code: otp, expiresAt: otpExpiry() };
        await user.save();

        await sendOTPEmail(email, otp);
        res.json({ message: 'OTP sent to your email for password reset.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const resetPasswordWithOtp = async(req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne ({ email });
        if (!user) return res.status(404).json({ message: 'user not found' });
        if (user.isBlocked) return res.status(403).json({ message: 'User is blocked' });

        console.log(user.otp, otp, user.otp.expiresAt, new Date());

        if (
            !user.otp ||
            user.otp.code !== otp ||
            !user.otp.expiresAt ||
            user.otp.expiresAt < new Date()
        ) {
            return res.status(400).json({ message:'Invalid or expired OTP' });
        }

        user.password = await hashPassword(newPassword);
        user.otp = undefined;
        await user.save();
        
        res.json({ message: 'Password reset successful. You can now log in with your new password.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });
        const result = await userService.refresh(refreshToken);
        res.json(result);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await userService.getProfile(req.user._id);
        res.json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.profilePic = req.file.path; // Assuming the file path is stored in req.file.path
        }
        // Prevent users from updating their own role
        if ('role' in updateData) {
            return res.status(403).json({ message: 'You cannot change your own role' });
        }
        const user = await userService.updateProfile(req.user._id, updateData);;
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const blockUser = async (req, res) => {
    try {
        const user = await userService.blockUser(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const unblockUser = async (req, res) => {
    try {
        const user = await userService.unblockUser(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers(req.query);
        res.json(users);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await userService.deleteUser(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        // Prevent non-admin users from updating roles
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can update user roles' });
        }
        const { role } = req.body;
        const { id } = req.params;
        if (!role) return res.status(400).jsson({ message: 'Role is required' });
        const updatedUser = await userService.updateUserRole(id, role);
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};