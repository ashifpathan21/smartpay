import mongoose, { Schema, Types } from "mongoose";

const transactionSchema = new Schema({
    mode: { type: String, enum: ["RECEIVED", "TRANSFER"], required: true },
    from: { type: Types.ObjectId, required: true, ref: "user" },
    to: { type: Types.ObjectId, required: true, ref: "user" },
    amount: { type: Number, required: true },
    tag: { type: String },
    createdAt: { type: Date, default: Date.now() }
})

export default mongoose.model("transaction", transactionSchema)