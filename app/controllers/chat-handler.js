import Chat from "../models/chat-model.js";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

export const chatCltr = {}

const chatHandler = (io, socket) => {
    socket.on("joinGeneralChat", async ({ meetingId, userId }) => {
        try {
            // Convert IDs if needed
            const userObjectId = new ObjectId(userId);
            const meetingObjectId = meetingId ? new ObjectId(meetingId) : null;

            // You might consider storing meetingObjectId in socket for later use if needed:
            socket.meetingObjectId = meetingObjectId;

            socket.join("general-chat");
            console.log(`User ${userId} joined general chat.`);
        } catch (error) {
            console.error("Error joining general chat:", error);
            socket.emit("error", "An error occurred while joining the general chat.");
        }
    });


    socket.on("sendGeneralMessage", async ({ message }) => {
        // Destructure message fields

        const { text, userId, meetingId } = message;

        if (!text.trim()) {
            console.log("Empty message. Skipping save.");
            return;
        }

        // Convert meetingId to an ObjectId here
        const meetingObjectId = meetingId ? new ObjectId(meetingId) : null;

        // Broadcast the message to everyone in the general chat
        io.to("general-chat").emit("receiveGeneralMessage", {
            text,
            userId,
            meetingId: meetingObjectId,
            timestamp: new Date(),
        });

        try {
            // Save the chat message in the database
            if (!mongoose.connection.readyState) {
                console.error("MongoDB is not connected!");
                return;
            }


            const chatMessage = new Chat({
                message: text,
                sender: userId,
                meetingId: meetingObjectId,
            });

            await chatMessage.save();
            console.log("General chat message saved:", chatMessage);
        } catch (error) {
            console.error("Error saving general chat message:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected from general chat:", socket.id);
    });
};

chatCltr.getChat = async (req, res) => {
    const meetingId = req.params.meetingId
    try {
        const meetingObjectId = meetingId ? new ObjectId(meetingId) : null;
        const messages = await Chat.find({ meetingId: meetingObjectId }).sort({ createdAt: -1 })
        return res.status(200).json(messages)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

export default chatHandler;
