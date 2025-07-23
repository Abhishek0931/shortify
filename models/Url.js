import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
    originalUrl: { type: String, required: true, unique: true },
    shortCode: { type: String, required: true, unique: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Url', urlSchema);