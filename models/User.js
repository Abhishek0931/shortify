import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({ 
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: /.+\@.+\..+/
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },

    profilePic: {
        type: String,
    },

    isBlocked: {
        type: Boolean,
        default: false
    },

    otp:{
        code: { type: String },
        expiresAt: { type: Date } 
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('User', userSchema);
// This schema defines the structure of the User document in MongoDB.
// It includes fields for username, email, password, role, profile picture, and timestamps for creation and updates.