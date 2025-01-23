import mongoose, { Schema, model } from "mongoose";

const meetingScheduleSchema = new Schema({
    mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    menteeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    date: Date,
    time: String,
    plan: String,
    status: {
        type: String, enum: ['pending', 'scheduled', 'completed', 'canceled'], default: 'pending'
    },
    video: String,
    meetingLink: String,
    summary: String,
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'
    }
}, { timestamps: true })

const Meeting = model("Meeting", meetingScheduleSchema)

export default Meeting