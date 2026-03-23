import mongoose, { Schema, Document } from 'mongoose';

export interface IHazardFeedback extends Document {
    hazardId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    feedback: 'confirmed' | 'denied';
    isPassthrough: boolean;
}

const HazardFeedbackSchema: Schema = new Schema({
    hazardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hazard', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    feedback: { type: String, enum: ['confirmed', 'denied'], required: true },
    isPassthrough: { type: Boolean, default: false }, // true = user physically passed through
}, { timestamps: true });

// One vote per user per hazard
HazardFeedbackSchema.index({ hazardId: 1, userId: 1 }, { unique: true });

export default mongoose.model<IHazardFeedback>('HazardFeedback', HazardFeedbackSchema);
