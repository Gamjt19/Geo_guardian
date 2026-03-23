import mongoose, { Schema, Document } from 'mongoose';

export interface IGuidePointEvent extends Document {
    userId: mongoose.Types.ObjectId;
    points: number;
    reason: 'hazard_submitted' | 'hazard_approved_bonus' | 'hazard_rejected_penalty' | 'passthrough_confirmed';
    hazardId?: mongoose.Types.ObjectId | null;
}

const GuidePointEventSchema: Schema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    points: { type: Number, required: true }, // positive or negative
    reason: { type: String, enum: ['hazard_submitted', 'hazard_approved_bonus', 'hazard_rejected_penalty', 'passthrough_confirmed'] },
    hazardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hazard', default: null },
}, { timestamps: true });

export default mongoose.model<IGuidePointEvent>('GuidePointEvent', GuidePointEventSchema);
