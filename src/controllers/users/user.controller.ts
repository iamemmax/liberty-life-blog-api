import AsyncHandler from "express-async-handler"
import {Request, Response} from "express-serve-static-core"
import { authenticateUserTypes, createuserTypes } from "../../validations/interface/userTypes"
import userModel, { UserProps } from "../../models/user.model"
import { hashPassword } from "../../helpers/bcrypt"
import { HydratedDocument } from "mongoose"
import { sendMail } from "../../helpers/sendMail"
import bcrypt from 'bcryptjs';
import generateToken from "../../helpers/generateToken"
import Jwt from "jsonwebtoken";
import { getUser } from "../../service/getUser"

// @DESC:signup an admin
//@METHOD:Post
//@ROUTES:localhost:3001/api/users/create
    export const createUser = (AsyncHandler(async (req: Request<{}, {}, createuserTypes>, res: Response) => {
        const {email,username,password}=req.body
        try {
            // check if user already exist
            const user_with_email_exist = await userModel.findOne({email})
            const user_with_username_exist = await userModel.findOne({username})
            if(user_with_email_exist){
                res.status(401)
                throw new Error(`user with ${email} already exist`)
            }
            if(user_with_username_exist){
                res.status(401)
                throw new Error(`user with ${username} already exist`)
            }
// 
            const genUserId = `userId_${username}${email.slice(0, 5)}${Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000}${password.slice(0, 4)}${password.slice(0, 3)}`
            const { hash } = await hashPassword(password)
            const data: HydratedDocument<UserProps> = await new userModel({
                userId: genUserId, username, email, password: hash, token: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000
            }).save()
            if (data) {
                sendMail(
                    email,
                    "emmax-shop registration",
                    `            <html>
                    <head>
                    <body>
                    <h1 style={font-size:24px}>Welcome to king store</h1>
                    <p style={color:red, font-size:18px}>Your otp verification code is ${data?.token}</p>
                    </body>
                    </head>
                    </html>
                    `
                );
                res.status(201).json({
                    user: { res: "ok", userId: data?.userId, username, email }
                    , msg: "Registration is successful. A verification OTP has been sent to your email."
                }
                )
            }
        } catch (error: any) {
            res.status(401);
            throw new Error(error.message);
        }
    
       
}))

// @DESC:Authenticate user
//@METHOD:POST
//@ROUTES:localhost:3001/api/users/authenticate

export const loginAdmin = (AsyncHandler(async (req: Request<{}, {}, authenticateUserTypes>, res: Response) => {
    let { email, password } = req.body
    try {
        const userExist = await userModel.findOne<UserProps>({ email }).select(" -__v ")

        if (userExist) {
            const compared = await bcrypt.compareSync(password, userExist?.password)
            if (!compared) {
                res.status(400);
                throw new Error("email or password not correct");
            }

            if (compared) {
                const { userId, email, firstname, roles, username, lastname, createdAt, verified, _id } = userExist
                const token = await generateToken(res, userExist._id as string)
                // console.log(await generateToken(res, userExist._id as string));
                
                res.status(201).send({
                    token : Jwt.sign({ userId }, String(process.env.JWT_PRIVATE_KEY), {
                        expiresIn: '1d',
                    }),
                    user: {
                        _id, userId, email, firstname, username, lastname, roles, verified, createdAt,
                    },
                    msg: "Authentication successful"
                })
            }else{
                res.status(404)
                throw new Error("invalid credentials");
            }
        } else {
            res.status(400);
            throw new Error("no or unverified account");
        }
    } catch (error: any) {
        res.status(401);
        throw new Error(error.message);
    }

}))

// @DESC:get current user
//@METHOD:GET
//@ROUTES:localhost:3001/api/users/me/:userId

export const getCurrentUser = AsyncHandler(async (req: Request, res: Response) => {
    let { userId } = req.params
    if (!userId) {
        throw new Error("userid is required")
    }


    try {
        const user = await getUser({ userId })
        // const user = await userModel.findById(userId)
        if (!user) {
            res.status(400)
            throw new Error("user not found");
        }
        res.status(201).json({
            res: "ok",
            user,
            msg: "success"
        })


    } catch (error: any) {
        res.status(401)
        throw new Error(error.message);
    }
})


export const logoutUser = AsyncHandler(async (req: Request, res: Response) => {
    try {
        res.cookie('libertylifeauth', '', {
            httpOnly: true,
            expires: new Date(0),
        });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error: any) {
        // Handle unexpected errors with a 500 status code
        res.status(500).json({ message: 'Internal server error' });
        console.error(error); // Log the error for debugging purposes
    }
});

// @DESC:get all users list
//@METHOD:GET
//@ROUTES:localhost:3001/api/admin
//@ROLES:admin

export const listUsers = AsyncHandler(async (req: Request, res: Response) => {

    try {
        const users = await userModel.find().select("-__v -password")
        res.status(201).json({
            res: "ok",
            total: users?.length,
            users
        })
    } catch (error: any) {
        res.status(401)
        throw new Error(error.message);
    }
})

// @DESC:delete admin
//@METHOD:Delete
//@ROUTES:localhost:3001/api/delete:userId
//@ROLES:admin

export const deleteAdmin = AsyncHandler(async (req: Request, res: Response) => {
    let { userId } = req.params
    if (!userId) {
        throw new Error("userid is required")
    }
    try {
        const user = await userModel?.findOneAndDelete({userId})
        if (!user) {
            res.status(400)
            throw new Error("user not found");
        }
        res.status(201).json({
            res: "ok",
            user,
            msg: "admin deleted successfully"
        })
    } catch (error: any) {
        res.status(401)
        throw new Error(error.message);
    }
})