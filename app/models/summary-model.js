import mongoose, { Schema, model } from "mongoose";

const summarySchema = new Schema({
    meetingId: {
        type: mongoose.Types.ObjectId,
        ref: "Meeting"
    },
    mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    menteeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    audioFile: {
        url: String,
        publicId: String,
        format: String,
        duration: Number
    },
    transcript: String,
    summary: String
}, { timestamps: true })

const Summary = model("Summary", summarySchema)

export default Summary