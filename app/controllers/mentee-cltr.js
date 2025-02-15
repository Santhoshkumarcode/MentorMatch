import Mentee from "../models/mentee-model.js";
import cloudinary from '../utils/cloudinary.js';
import upload from '../middlewares/multer.js';
import fs from 'fs';

const menteeCltr = {}

menteeCltr.updateMentee = async (req, res) => {
    const id = req.params.id
    const body = req.body

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
                folder: "mentee_profiles/",
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

        const mentee = await Mentee.findOneAndUpdate({ userId: id }, updatedBody, { new: true, runValidators: true })
        if (!mentee) {
            return res.status(404).json({ error: "Record not found" });
        }
        return res.status(200).json(mentee)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

menteeCltr.getProfile = async (req, res) => {
    const id = req.params.id
    try {
        const mentee = await Mentee.findOne({ userId: id }).populate('userId').populate('skills')
        if (!mentee) {
            return res.status(404).json('Mentor not found')
        }
        return res.json(mentee)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}
export default menteeCltr