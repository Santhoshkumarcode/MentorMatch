import { Schema, model } from "mongoose"

const skillSchema = new Schema({
    skill:String
}, { timestamps: true })

const Skills = model("Skills", skillSchema)

export default Skills