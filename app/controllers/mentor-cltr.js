import Mentor from "../models/mentor-model.js";
import _ from "lodash"
import cloudinary from '../utils/cloudinary.js';  // Cloudinary config
import upload from '../middlewares/multer.js';  // Multer upload
import fs from 'fs';  // To delete the temporary file

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

mentorCltr.updateMentor = async (req, res) => {
    const id = req.params.id;
    const body = req.body;

    // Promisify Multer upload
    const multerUpload = () =>
        new Promise((resolve, reject) => {
            upload(req, res, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

    try {
        // Wait for Multer to handle file upload
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

        const mentor = await Mentor.findByIdAndUpdate(id, updatedBody, { new: true, runValidators: true, });

        if (!mentor) {
            return res.status(404).json({ error: "Record not found" });
        }

        return res.status(200).json(mentor);
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
};



export default mentorCltr