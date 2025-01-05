import Mentor from "../models/mentor-model.js";
import _ from "lodash"

const mentorCltr = {}

mentorCltr.createMentor = async (req, res) => {
    const mentorDetails = _.pick(req.body, ["companyName", "jobTitle", "linkedIn", "personalWebsite", "experiences"])
    
    try {
        const mentor = new Mentor(mentorDetails)
        mentor.mentorId = req.currentUser.userId
        await mentor.save()
        return res.status(201).json(mentor)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

export default mentorCltr