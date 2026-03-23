import express from 'express';
import User from '../models/User';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// GET /api/guides/leaderboard -> Top guides by guidePoints (limit 20)
router.get('/leaderboard', async (req, res) => {
    try {
        const topGuides = await User.find({ role: { $in: ['local_guide', 'admin'] } })
            .sort({ guidePoints: -1 })
            .limit(20)
            .select('name guideLevel guidePoints totalContributions role');
        res.json(topGuides);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// POST /api/guides/apply -> Apply to become a local guide (sets role='local_guide', guideLevel=1)
router.post('/apply', authenticate, async (req: any, res) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (user.role === 'admin' || user.role === 'local_guide') {
            return res.status(400).json({ error: 'User is already a guide or admin' });
        }

        user.role = 'local_guide';
        user.guideLevel = 1;
        user.guidePoints = 0;
        await user.save();

        res.json({ message: 'Successfully applied to be a local guide', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// GET /api/guides/:userId/profile -> Guide profile
router.get('/:userId/profile', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('name role guideLevel guidePoints totalContributions guideVerifiedAt');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

export default router;
