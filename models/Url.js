
import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
    originalUrl: { type: String, required: true },
    shortCode: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

// Unique index on (originalUrl, createdBy)
urlSchema.index({ originalUrl: 1, createdBy: 1 }, { unique: true });
// Unique index on (shortCode, createdBy)
urlSchema.index({ shortCode: 1, createdBy: 1 }, { unique: true });

export default mongoose.model('Url', urlSchema);