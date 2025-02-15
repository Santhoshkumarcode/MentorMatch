import Chat from "../models/chat-model.js";
import { ObjectId } from "mongodb";

const chatHandler = (io, socket) => {
    socket.on("joinGeneralChat", async ({ meetingId, userId }) => {
        try {
            const userObjectId = new ObjectId(userId);
            socket.join("general-chat");
            console.log(`User ${userId} joined general chat.`);
        } catch (error) {
            console.error("Error joining general chat:", error);
            socket.emit("error", "An error occurred while joining the general chat.");
        }
    });

    socket.on("sendGeneralMessage", async ({ message }) => {
        const { text, userId } = message;

        if (!text.trim()) {
            console.log("Empty message. Skipping save.");
            return;
        }

        // Broadcast message to all users in general chat
        io.to("general-chat").emit("receiveGeneralMessage", {
            text,
            userId,
            username,
            timestamp: new Date(),
        });

        try {
            const userObjectId = new ObjectId(userId);

            const chatMessage = new Chat({
                message: text,
                sender: userId,
                meetingId,
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

export default chatHandler;