import mongoose, { Schema, model } from "mongoose"

const mentorSchema = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    fullName: String,
    profilePic: String,
    companyName: String,
    jobTitle: String,
    phoneNumber: Number,
    about: String,
    availability: {
        type: String,
        enum: ['available', 'notAvailable'],
        default: "available"
    },
    bio: String,
    skills: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Skills'
        }
    ],
    experiences: [
        {
            startingDate: Date,
            endingDate: Date,
            companyName: String,
            position: String,
        }
    ],
    linkedIn: String,
    personalWebsite: String,
    location: String,
    spokenLanguages: [String],
    isVerified: {
        type: Boolean,
        default: false
    },
    pricing: {
        basic: {
            amount: Number,
            sessionDuration: String,
            call: Number,
            videoCall: Number,
            features: String,
        },
        pro: {
            amount: Number,
            sessionDuration: String,
            call: Number,
            videoCall: Number,
            features: String,
        }
    },
},{timestamps:true})

const Mentor = model("Mentor", mentorSchema)

export default Mentor