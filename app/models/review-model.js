import mongoose, { Mongoose, Schema, model } from "mongoose";

const reviewSchema = new Schema({
    reviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewer: {
        type: String,
        enum: ['mentor', 'mentee']
    },
    revieweeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewee: {
        type: String,
        enum: ['mentor', 'mentee']
    },
    meetingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Meeting'
    },
    rating: { type: Number, min: 1, max: 5 },
    reviewText: String,

}, { timestamps: true })

const Review = model("Review", reviewSchema)

export default Review