import mongoose, { Schema, Types } from "mongoose";


const accountSchema = new Schema({
    user: { type: Types.ObjectId, ref: "user", required: true, unique: true },
    balance: { type: Number, default: 1000 },
    dec: { type: Number, default: -1 },
    transactions: [
        {
            type: Types.ObjectId,
            ref: "transaction"
        }
    ],
    createdAt: { type: Date, default: Date.now() }
})

export default mongoose.model("account", accountSchema)

