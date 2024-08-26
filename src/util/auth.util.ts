import Jwt, { JwtPayload }  from "jsonwebtoken";
import { UserProps } from "../models/user.model";
import secretKey from "../config/jwtConfig";
export const generateToken = (user: UserProps) => {
    const payload = {
        userId: user?.userId,
        email: user?.email,
        username: user?.username
    };
    return Jwt.sign(payload,secretKey,{expiresIn:"1h"})

}
export const generateRefreshToken = (user: UserProps) => {
    const payload = {
        userId: user?.userId,
        email: user?.email,
        username: user?.username
    };
    return Jwt.sign(payload,secretKey,{expiresIn:"2h"})

}
export const verifyToken = (token: string)=>{
    return Jwt.verify(token, secretKey) as JwtPayload
}