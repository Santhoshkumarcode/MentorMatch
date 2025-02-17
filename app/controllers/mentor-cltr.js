import Mentor from "../models/mentor-model.js";
import Skills from "../models/skills-model.js"
import _ from "lodash"
import cloudinary from '../utils/cloudinary.js';
import upload from '../middlewares/multer.js';
import fs from 'fs';
import { mailToAdmin, sendMail } from "../utils/nodemailer.js";

import Stripe from "stripe"

import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
        const search = req.query.search || '';
        const skillFilter = req.query.skill || '';
        const sortBy = req.query.sortBy || 'pricing.basic.amount';
        const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 2;

        let searchQuery = {
            isVerified: true,
            $or: [
                { jobTitle: { $regex: search, $options: 'i' } },
                { 'skills.skill': { $regex: search, $options: 'i' } }
            ],
        };

        if (skillFilter) {
            const skills = await Skills.find({ skill: { $regex: skillFilter, $options: 'i' } });
            const skillIds = skills.map(skill => skill._id);

            searchQuery['skills'] = { $in: skillIds };
        }


        const mentors = await Mentor.find(searchQuery)
            .populate('userId')
            .populate('skills')
            .sort({ [sortBy]: sortOrder })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Mentor.countDocuments(searchQuery);

        return res.json({
            data: mentors,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
// get individual mentor profile
mentorCltr.getProfile = async (req, res) => {
    const id = req.params.id
    try {
        const mentor = await Mentor.findOne({ userId: id }).populate("userId").populate('skills')
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
            const mentor = await Mentor.findOneAndUpdate({ userId: id }, body, { new: true, runValidators: true }).populate('userId')
            if (!mentor) {
                return res.status(404).json('Mentor not available')
            }

            if (!mentor.stripeAccountId) {
                const account = await stripe.account.create({
                    type: "express",
                    email: mentor.userId.email,
                    country: "US",
                    capabilities: {
                        transfers: { requested: true },
                    },
                })
                mentor.stripeAccountId = account.id;
                await mentor.save();
            }


            const accountLink = await stripe.accountLinks.create({
                account: mentor.stripeAccountId,
                refresh_url: "http://localhost:5173/stripe-onboarding",
                return_url: "http://localhost:5173/",
                type: "account_onboarding",
            }); 
            
            await sendMail(
                mentor.userId.email,
                "Complete Your Stripe Registration",
                `Hi ${mentor.userId.username},
                    Your mentor profile has been verified! To receive payments from mentees, please complete your Stripe registration by clicking the link below:
                    ➡️ Complete Stripe Setup(${accountLink.url})
                    Thank You.`);

            return res.status(200).json(mentor)
        } catch (err) {
            console.log(err)
            return res.status(500).json({'error': err})
        }
}


export default mentorCltr