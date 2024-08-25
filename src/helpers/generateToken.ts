import { Response } from "express";
import Jwt from "jsonwebtoken";

const generateToken = (res: Response, userId: string | number) => {
    const token = Jwt.sign({ userId }, String(process.env.JWT_PRIVATE_KEY), {
        expiresIn: '1d',
    });

    res.cookie('libertyLifeAuth', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
        sameSite: 'strict', // Prevent CSRF attacks
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
}

export default generateToken;
