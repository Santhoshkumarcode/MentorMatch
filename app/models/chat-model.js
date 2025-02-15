import mongoose, { Schema, model } from "mongoose";

const chatSchema = new Schema({
    sender: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    meetingId: {
        type: mongoose.Types.ObjectId,
        ref: 'Meeting'
    },
    message: String,

}, { timestamps: true })

const Chat = model('Chat', chatSchema)

export default Chat