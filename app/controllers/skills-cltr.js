import Skills from "../models/skills-model.js";

const skillsCltr = {}

skillsCltr.create = async (req, res) => {
    const body = req.body
    try {
        const skill = await Skills.create(body)
        return res.status(200).json(skill)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

skillsCltr.getAll = async (req, res) => {
    try {
        const skill = await Skills.find()
        return res.status(200).json(skill)

    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}


export default skillsCltr