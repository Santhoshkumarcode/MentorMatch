import { Schema, model } from "mongoose";

const userSchema = new Schema({
    username: String,
    email: String,
    password: String,
    role: {
        type: String,
        enum:['admin','mentor','mentee']
    }
}, { timestamps: true })

const User = model("User", userSchema)

export default User