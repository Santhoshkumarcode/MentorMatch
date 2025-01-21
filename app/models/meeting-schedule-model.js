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
    duration: String,
    plan: String,
    status: {
        type: String, enum: ['pending', 'scheduled', 'completed', 'canceled'], default: 'pending'
    },
    video:String,
    meetingLink: String,
    summary: String
}, { timestamps: true })

const Meeting = model("Meeting", meetingScheduleSchema)

export default Meeting