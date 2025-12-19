import type { Request, Response } from "express";
import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { MongooseError } from "mongoose";
import type { UserRequest } from "../types/express/index.js";
import { JWT_SECRET } from "../config.js";
import { StatusCodes } from "http-status-codes";

export const SignIn = async (req: Request, res: Response) => {
    try {
        const { username, password, firstName, lastName } = req.body;
        if (!username || !password || !firstName) {
            return res.status(StatusCodes.NO_CONTENT).json({
                success: false,
                message: "Fields are missing"
            })
        }
        const existing = await UserModel.findOne({ username });
        if (existing) {
            return res.status(StatusCodes.CONFLICT).json({
                success: false,
                message: "User already Exist"
            })
        }
        //salting to prevent the same same hash
        const hashPass = await bcrypt.hash(`${username}${password}`, 16);
        const user = await UserModel.create({
            firstName,
            lastName,
            username,
            password: hashPass
        })
        const token = jwt.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: "2d"
        });
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Account Created Successfully",
            token: token
        })
    } catch (error) {
        if (error instanceof MongooseError) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message,
                error
            })
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error",
            error
        })
    }
}




export const Login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(StatusCodes.NO_CONTENT).json({
                success: false,
                message: "Fields are Missing"
            })
        }

        const user = await UserModel.findOne({ username }).select("+password");
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "User not Found"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Incorrect Username or Password"
            })
        }
        const token = await jwt.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: "2d"
        });
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Logged In ",
            data: token
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error",
            error
        })
    }
}


export const getProfile = async (req: UserRequest, res: Response) => {
    try {
        const userId = req?.user?.id;
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized"
            })
        }
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "User not found "
            })
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "",
            data: user
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}


export const isAvailable = async (req: Request, res: Response) => {
    try {
        const { username } = req.body;
        const user = await UserModel.findOne(username);
        return res.status(StatusCodes.OK).json({
            success: true,
            message: user ? "Not Available" : "Available"
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}


export const updateUser = async (req: UserRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized"
            })
        }
        const { firstName, lastName, password } = req.body;
        const user = await UserModel.findByIdAndUpdate(userId, {
            firstName,
            lastName,
            password
        });
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Update Successful"
        })

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error",
            error
        })
    }
}


export const findUser = async (req: UserRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(501).json({
                success: false,
                message: "Unauthorized"
            })
        }
        const query = req.params.query;
        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Query not found "
            })
        }
        const users = await UserModel.find(
            {
                $or: [
                    { username: { $regex: query } },
                    { firstName: { $regex: query } },
                    { lastName: { $regex: query } }
                ]
            }
        );

        return res.status(200).json({
            sucess: true,
            data: users,
            message: users ? "" : "No user found "
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}