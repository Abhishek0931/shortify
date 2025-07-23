import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const refreshToken = req.headers['x-refresh-token'] || req.body?.refreshToken;

    if (!authHeader && !refreshToken) {
        return res.status(401).json({ message: 'No token provided' });
    }

    // Try access token first
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }
            return next();
        } catch (error) {
            if (error.name !== 'TokenExpiredError') {
                return res.status(401).json({ message: 'Invalid access token' });
            }
            // If token expired, try refresh token
        }
    }

    // Try refresh token if access token is missing or expired
    if (refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({ message: 'User not found (refresh token)' });
            }
            req.tokenType = 'refresh';
            return next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Refresh token expired. Please login again.' });
            }
            return res.status(401).json({ message: 'Invalid refresh token' });
        }
    }

    return res.status(401).json({ message: 'No valid token provided' });
};