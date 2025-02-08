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

    dates: {
        type: [Date],
    },
    registeredDate: Date,
    time: String,
    plan: String,
    status: {
        type: String, enum: ['pending', 'scheduled', 'completed', 'canceled'], default: 'pending'
    },
    video: String,
    meetingLink: String,
    transcript: String,
    summary: String,
    mentorshipGoal: String,
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'
    }
}, { timestamps: true })

const Meeting = model("Meeting", meetingScheduleSchema)

export default Meeting