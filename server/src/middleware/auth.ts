import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

// Extend Express Request object to include user
export interface AuthRequest extends Request {
    user?: any; // You can type this to IUser if you want strictly
}

// Basic mock middleware to simulate a logged-in user if token isn't provided
// For a production app, verify the JWT here.
export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    // We expect user id in header for now to mock authentication since there was no JWT setup.
    // Replace with proper JWT decoding later.
    const userId = req.headers['x-user-id'];
    if (userId) {
        try {
            const user = await User.findById(userId);
            if (user) {
                req.user = user;
            }
        } catch (err) {}
    }
    next();
};

export const requireGuide = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || (req.user.role !== 'local_guide' && req.user.role !== 'admin')) {
        return res.status(403).json({ error: 'Local Guide access required' });
    }
    next();
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};
