import mongoose, { Schema, model } from "mongoose"

const menteeSchema = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    fullName: String,
    phoneNumber: String,
    profilePic: String,
    bio: String,
    location: String,
    education: [
        {
            startYear: Number,
            endYear: Number,
            institute: String,
            degree: String,
            fieldOfStudy: String
        }
    ] ,
    linkedIn:String,
    skills: [{
        type: mongoose.Types.ObjectId,
        ref: "Skills"
    }],
}, { timestamps: true })

const Mentee = model("Mentee", menteeSchema)

export default Mentee