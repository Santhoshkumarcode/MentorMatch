import mongoose, { Schema, model } from "mongoose";

const reviewSchema = new Schema({
    reviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    revieweeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    rating: { type: Number, min: 1, max: 5 },
    reviewText: String,

}, { timestamps: true })

const Review = model("Review", reviewSchema)

export default Review