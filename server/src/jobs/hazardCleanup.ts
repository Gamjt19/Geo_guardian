import cron from 'node-cron';
import Hazard from '../models/Hazard';
import HazardFeedback from '../models/HazardFeedback';

// Runs every hour
cron.schedule('0 * * * *', async () => {
    try {
        console.log('Running hazard cleanup job...');
        
        // 1. Expire overdue hazards
        const expResult = await Hazard.updateMany(
            { expiresAt: { $lt: new Date() }, status: { $ne: 'expired' } },
            { status: 'expired' }
        );
        console.log(`Expired ${expResult.modifiedCount} hazards.`);

        // 2. Flag approved hazards with too many "denied" passthrough votes for admin review
        const approvedHazards = await Hazard.find({ status: 'admin_approved' });
        let flaggedCount = 0;

        for (const hazard of approvedHazards) {
            const recentDenials = await HazardFeedback.countDocuments({
                hazardId: hazard._id,
                feedback: 'denied',
                isPassthrough: true,
                createdAt: { $gte: new Date(Date.now() - 3 * 60 * 60 * 1000) } // last 3 hours
            });
            if (recentDenials >= 3) {
                await Hazard.findByIdAndUpdate(hazard._id, { flaggedForReview: true, status: 'pending_verification' });
                flaggedCount++;
            }
        }
        
        console.log(`Flagged ${flaggedCount} hazards for review.`);
    } catch (err) {
        console.error('Error in hazard cleanup job:', err);
    }
});
