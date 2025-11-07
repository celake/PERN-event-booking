import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { checkUserIdExists } from '../services/auth.services.js';


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