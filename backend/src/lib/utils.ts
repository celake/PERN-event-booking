import jwt from 'jsonwebtoken';
import { Response } from 'express';

export const generateToken = (userId: number, res:Response): string => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token: string = jwt.sign({userId}, secret, { 
        expiresIn:"7d",
    })

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV != "development"
    })

    return token;
};

export const isValidObject = (obj: Record<string, any>): boolean => {
    console.log(!obj);
    console.log(typeof obj === 'object');
    console.log(Object.keys(obj).length === 0)
    const isObject: boolean =  !(!obj || (typeof obj !== 'object' && Object.keys(obj).length === 0);)
    const hasValidValues: boolean = Object.values(obj).some(value => {
        if (value === null || value === undefined) return false;
        if (typeof value === 'string') value = value.trim();
        return value !== "";
    });
    return isObject && hasValidValues;
}