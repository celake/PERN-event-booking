import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { checkUserIdExists } from '../services/auth.services.js';
import { getUserRole } from '../services/users.services.js';
import { UserRole } from '../types/user.types.js';


export const protectRoute = async (req: Request, res: Response, next: NextFunction): Promise< void > => {
    try {
        const token = req.cookies.jwt;

        if(!token) {
            return res.status(401).json({message: "Unauthorized - no token provided"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };

        const userExists = await checkUserIdExists(decoded.userId);

        if (!userExists) {
            return res.status(401).json({message: "User not found."})
        }

        req.userId = decoded.userId
        next();

    } catch (error) {
        console.log("Error in protectRoute Middleware", error);
        res.status(401).json({ message: "Unauthorized - invalid token" });
    }
}

export const decodeUser = async (req: Request, res: Response, next: NextFunction): Promise< void > => {
    try {
        const token = req.cookies.jwt;

        if(!token) {
            req.userId = undefined;
            return next()
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };

        const userExists = await checkUserIdExists(decoded.userId);

        if (!userExists) {
            return res.status(401).json({message: "User not found."})
        }

        req.userId = decoded.userId
        next();

    } catch (error) {
        console.error("Error in decodeUser Middleware", error);
        req.userId = undefined;
        next();
}
}

export const requireOrganizer = async (req: Request, res: Response, next: NextFunction): Promise< void > => {

    try {
        const userId = req.userId!;
        
        const userRole: UserRole = await getUserRole(userId)
        if (userRole !== 'organizer') {
            return res.status(403).json({message: "Unauthorized to preform this action"})
        }

        next();
    } catch (error) {
        console.log("Error in requireOrganizer Middleware", error);
        res.status(401).json({ message: "Unauthorized" });
    }
    
}