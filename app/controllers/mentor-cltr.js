import Mentor from "../models/mentor-model.js";
import _ from "lodash"
import cloudinary from '../utils/cloudinary.js';
import upload from '../middlewares/multer.js';
import fs from 'fs';
import { mailToAdmin } from "../utils/nodemailer.js";

const mentorCltr = {}

// to create after mentor register
mentorCltr.createMentor = async (req, res) => {
    const mentorDetails = _.pick(req.body, ["companyName", "jobTitle", "linkedIn", "personalWebsite", "experiences"])

    try {
        const mentor = new Mentor(mentorDetails)
        mentor.userId = req.currentUser.userId
        await mentor.save()
        await mailToAdmin("New Mentor registered", `Hello Admin,In our MentorMatch a new Mentor has registered`)
        return res.status(201).json(mentor)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}
// mentor second additiona info form
mentorCltr.additionalInfo = async (req, res) => {
    const userId = req.params.id
    console.log(userId)
    const body = req.body
    console.log(body)
    try {
        const mentor = await Mentor.findOneAndUpdate({ userId: userId }, body, { new: true, runValidators: true, });
        if (!mentor) {
            return res.status(500).json('Record not found')
        }
        //await mailToAdmin("New Mentor registered", `Hello Admin,In our MentorMatch a new Mentor has registered`)
        return res.json(mentor)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}
// to update mentor in profile
mentorCltr.updateMentor = async (req, res) => {
    const id = req.params.id;
    const body = req.body;

    const multerUpload = () =>
        new Promise((resolve, reject) => {
            upload(req, res, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

    try {
        await multerUpload();

        let imageUrl = null;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "mentor_profiles/",
                use_filename: true,
                unique_filename: false,
            });

            imageUrl = result.secure_url;
            fs.unlinkSync(req.file.path);
        }
        const updatedBody = {
            ...body,
            ...(imageUrl && { profilePic: imageUrl }),
        };
        const mentor = await Mentor.findOneAndUpdate({ userId: id }, updatedBody, { new: true, runValidators: true, });

        if (!mentor) {
            return res.status(404).json({ error: "Record not found" });
        }

        return res.status(200).json(mentor);
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
};

//get all mentor details to verify by admin
mentorCltr.getAll = async (req, res) => {
    try {
        const mentor = await Mentor
            .find()
            .populate('userId')
        return res.status(200).json(mentor)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }

}

// show only who's profile is verified by admin
mentorCltr.getVerified = async (req, res) => {
    try {
        const mentor = await Mentor
            .find({ isVerified: true })
            .populate('userId')
            .populate('skills')
        if (!mentor) {
            return res.status(404).json('Mentor not found')
        }
        return res.json(mentor)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

// get individual mentor profile
mentorCltr.getProfile = async (req, res) => {
    const id = req.params.id
    try {
        const mentor = await Mentor.findOne({ userId: id }).populate("userId")
        if (!mentor) {
            return res.status(404).json('Mentor not found')
        }
        return res.json(mentor)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}


// to delete profile
mentorCltr.deleteProfile = async (req, res) => {
    const id = req.params.id
    try {
        const mentor = await Mentor.findOneAndDelete({ userId: id })
        if (!mentor) {
            return res.status(404).json('Record not found')
        }
        return res.json(mentor)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

// is verified 
mentorCltr.isVerified = async (req, res) => {
    const id = req.params.id
    const body = req.body
    try {
        const mentor = await Mentor.findOneAndUpdate({ userId: id }, body, { new: true, runValidators: true })
        if (!mentor) {
            return res.status(404).json('Mentor not available')
        }
        return res.status(200).json(mentor)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}


export default mentorCltr