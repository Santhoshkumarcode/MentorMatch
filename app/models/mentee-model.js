import mongoose,{ Schema, model } from "mongoose"

const menteeSchema = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    fullName: String,
    phoneNumber: String,
    profilePic: String,
    education: [
        {
            startYear: Number,
            endYear: Number,
            institute: String,
            degree: String,
            cgp: String,
            fieldOfStudy: String
        }
    ],
    skills: [{
        type: mongoose.Types.ObjectId,
        ref: "skills"
    }],
},{timestamps:true})

const Mentee = model("Mentee", menteeSchema)

export default Mentee