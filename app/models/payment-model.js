import { Schema, model } from "mongoose"

const paymentSchema = new Schema({
    menteeId: {
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    mentorId: {
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    transactionId: String,
    amount: Number,
    paymentStatus: {
        type: String,
        enum: ["pending", "succeeded", "failed"],
        default: "pending",
    },
    paymentType: {
        type: String,
        default:'card'
    }
}, { timestamps: true })

const Payment = model("Payment", paymentSchema)

export default Payment