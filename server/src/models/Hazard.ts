import mongoose, { Schema, Document } from 'mongoose';

export interface IHazard extends Document {
    name: string;
    type: 'school_zone' | 'hospital_zone' | 'speed_breaker' | 'sharp_turn' | 'bad_road';
    location: {
        type: 'Point';
        coordinates: number[]; // [lng, lat]
    };
    radiusMeters?: number;
    allowedVehicles?: string[];
    description?: string;
}

const HazardSchema: Schema = new Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['school_zone', 'hospital_zone', 'speed_breaker', 'sharp_turn', 'bad_road'], required: true },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], required: true }
    },
    radiusMeters: { type: Number, default: 0 },
    allowedVehicles: { type: [String], default: [] },
    description: { type: String }
});

HazardSchema.index({ location: '2dsphere' });

export default mongoose.model<IHazard>('Hazard', HazardSchema);
