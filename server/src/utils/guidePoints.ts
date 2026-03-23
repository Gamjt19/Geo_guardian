import mongoose from 'mongoose';
import User from '../models/User';
import GuidePointEvent from '../models/GuidePointEvent';

const GUIDE_TIERS = [0, 50, 200, 500, 1000, 3000, 7500];

export async function awardPoints(
    userId: string | mongoose.Types.ObjectId,
    points: number,
    reason: 'hazard_submitted' | 'hazard_approved_bonus' | 'hazard_rejected_penalty' | 'passthrough_confirmed',
    hazardId: string | mongoose.Types.ObjectId | null = null
) {
    await GuidePointEvent.create({ userId, points, reason, hazardId });
    
    // Find before updating to make sure it doesn't go below 0
    const existingUser = await User.findById(userId);
    if (!existingUser) return;

    const newPoints = Math.max(0, existingUser.guidePoints + points);
    
    const user = await User.findByIdAndUpdate(
        userId,
        { 
            guidePoints: newPoints,
            $inc: { totalContributions: points > 0 ? 1 : 0 }
        },
        { new: true }
    );

    if (!user) return;

    // Recalculate guide level
    let newLevel = 1;
    for (let i = 0; i < GUIDE_TIERS.length; i++) {
        if (user.guidePoints >= GUIDE_TIERS[i]) {
            newLevel = i + 1; // 1-indexed (Level 1, Level 2, etc.)
        }
    }

    if (newLevel !== user.guideLevel) {
        await User.findByIdAndUpdate(userId, { guideLevel: newLevel });
    }
}
