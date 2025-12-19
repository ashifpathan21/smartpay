import type { Response } from "express";
import AccountModel from "../models/accountModel.js";
import type { UserRequest } from "../types/express/index.js";
import { StatusCodes } from "http-status-codes";
import UserModel from "../models/userModel.js";
import mongoose from "mongoose";
import TransactionModel from "../models/transactionModel.js";
import { decodeBalance, encodeBalance } from "../utils/balance.js";

export const createAccount = async (req: UserRequest, res: Response) => {
    const session = await mongoose.startSession();

    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized",
            });
        }

        session.startTransaction();

        const user = await UserModel.findById(userId).session(session)
        if (!user) {
            throw new Error("User not found");
        }
        const [account] = await AccountModel.create(
            [{
                user: user._id,
                balance: 1 + Math.floor(Math.random() * 10000)
            }],
            { session }
        );
        if (!account) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Something Went Wrong"
            })
        }
        await UserModel.findByIdAndUpdate(
            userId,
            { account: account._id },
            { session }
        );
        await session.commitTransaction();
        session.endSession();

        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Account created successfully",
        });

    } catch (error: any) {
        await session.abortTransaction();
        await session.endSession();

        // Duplicate key error (unique index)
        if (error.code === 11000) {
            return res.status(StatusCodes.CONFLICT).json({
                success: false,
                message: "Account already exists",
            });
        }

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error",
            error
        });
    }
};

export const getBalance = async (req: UserRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                messgae: "Unauthorized"
            })
        }
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "User Not Found"
            })
        }

        const account = await AccountModel.findOne({ user: userId });
        if (!account) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Account Not Exist"
            })
        }

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Balance Fetched Successfully",
            data: decodeBalance(account.balance, account.dec)
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error"
        })
    }

}

export const getTransactions = async (req: UserRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                messgae: "Unauthorized"
            })
        }
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "User Not Found"
            })
        }

        const account = await AccountModel.findOne({ user: userId }).populate("transactions").exec()
        if (!account) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Account Not Exist"
            })
        }

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Balance Fetched Successfully",
            data: account.transactions
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}
export const getTransactionsWithFriend = async (req: UserRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const friendId = req.params.id;

        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                messgae: "Unauthorized"
            })
        }
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "User Not Found"
            })
        }
        if (!friendId) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Fields are missing"
            })
        }
        const friend = await UserModel.findById(friendId);
        if (!friend) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "User Not Found"
            })
        }
        const transactions = await TransactionModel.find({ $or: [{ from: userId, to: friendId }, { from: friendId, to: userId }] }).sort("createdAt")

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Balance Fetched Successfully",
            data: transactions
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}


export const transferAmount = async (req: UserRequest, res: Response) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction()
        const userId = req.user?.id;
        const { to, tag } = req.body
        const amount = Number(req.body.amount)
        console.log("Transfering ", amount)
        if (!userId) {
            throw new Error("Unauthorized")
        }
        const user = await UserModel.findById(userId).session(session);
        if (!user) {
            await session.abortTransaction()
            await session.endSession()
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "User Not Found"
            })
        }

        const account = await AccountModel.findOne({ user: userId }).session(session)
        if (!account) {
            await session.abortTransaction()
            await session.endSession()
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Account Not Exist"
            })
        }

        if (amount <= 0 || account.balance < amount) {
            await session.abortTransaction()
            await session.endSession()
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Insufficient Balance"
            })
        }

        const receiver = await UserModel.findById(to).session(session);
        if (!receiver) {
            await session.abortTransaction()
            await session.endSession()
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Receiver Not Found"
            })
        }
        const receiverAccount = await AccountModel.findOne({ user: receiver._id }).session(session)
        if (!receiverAccount) {
            await session.abortTransaction()
            await session.endSession()
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Reciever Account Not Exist"
            })
        }
        const [transferTransaction] = await TransactionModel.create(
            [
                {
                    mode: "TRANSFER",
                    from: userId,
                    to,
                    tag,
                    amount,
                }
            ],
            { session }
        );

        const [receivedTransaction] = await TransactionModel.create(
            [
                {
                    mode: "RECEIVED",
                    from: userId,
                    to,
                    tag,
                    amount,
                }
            ],
            { session }
        );
        if (!transferTransaction || !receivedTransaction) {
            await session.abortTransaction()
            await session.endSession()
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Something Went Wrong"
            })
        }
        const userLeftAmmount = decodeBalance(account.balance, account.dec) - amount;
        const receiverAmount = decodeBalance(receiverAccount.balance, receiverAccount.dec) + amount;
        const userEncoded = encodeBalance(userLeftAmmount);
        const receiverEncoded = encodeBalance(receiverAmount)
        await AccountModel.findOneAndUpdate({ user: userId }, { balance: userEncoded.updatedNumber, dec: userEncoded.dotIndex, $push: { transactions: transferTransaction._id } }, { session })
        await AccountModel.findOneAndUpdate({ user: to }, { balance: receiverEncoded.updatedNumber, dec: receiverEncoded.dotIndex, $push: { transactions: receivedTransaction._id } }, { session })

        await session.commitTransaction();
        session.endSession()
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Payment Success"
        })
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error",
            error
        })
    }
}