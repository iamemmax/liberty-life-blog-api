const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
import { NextFunction, Request, Response } from "express";
import userModel, { UserProps } from "../models/user.model";
import Jwt  from "jsonwebtoken";
import secretKey from "../config/jwtConfig";


export const isAuthenticated = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let token;

    token = req.cookies.libertyLifeAuth;
    if (token) {
        try {
            const decoded = await jwt.verify(token, process.env.JWT_PRIVATE_KEY);
           //@ts-ignore
            req.user = await userModel.findById<UserProps>(decoded.userId).select("-password")
//@ts-ignore
            if (!req.user) {
                return res.status(403).json({
                    res: "failed",
                    message: "Your account is not verified, Check your email for verification link.",
                })
            }
            next()

            // console.log(req.user, "user");

        } catch (error) {
            if (error) {
                res.status(401)
                throw new Error('Not authorized, invalid token')

            }
        }
    } else {
        res.status(401)
        throw new Error('Not authorized, no token')

    }
    
})

export const isAdmin = (roles: any) => asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // const userId = req?.user?.userId

    try {
        //@ts-ignore
        const users = await userModel.findOne<UserProps>({ userId:req?.user?.userId })

        if (!users?.roles.includes(roles)) {
            return res.status(403).json({
                res: "fail",
                msg: "Access Denied"
            })
        }
        next()
    } catch (error: any) {
        return res.status(504).json({
            res: "fail",
            msg: error.message
        })


    }

})


export const AuthenticateToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header("Authorization")
    if (!authHeader) {
        return res.status(401).json({
                    res: "failed",
                    message: "Unauthorized:Missing Token.",
                })
    }
    const [bearer, token] = authHeader?.split(" ")
    if (bearer !== "Bearer" || !token) {
        return res.status(401).json({
                    res: "failed",
                    message: "Unauthorized:Invalid token format",
                })
    }
    Jwt.verify(token, secretKey, (err, user) => {
        if (err) {
             return res.status(403).json({
                    res: "failed",
                    message: "Forbidden:Invalid token ",
                })
        }
        // @ts-ignore
        req.user = user
        next()
    })
})