import User from "../models/user-model.js";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { validationResult } from "express-validator"

const userCltr = {}

userCltr.register = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const body = req.body
    try {
        const user = new User(body)
        const salt = await bcryptjs.genSalt()
        const hashedPassword = await bcryptjs.hash(body.password, salt)
        user.password = hashedPassword
        const countDocument = await User.countDocuments()
        if (countDocument === 0) {
            user.role = 'admin'
        }
        await user.save()

        /* if (role === "mentor") {
            const newMentor = await new Mentor({
                mentorId: user._id,
                fullName:user.username,
            })
            await newMentor.save()
        } */
        
        const tokenData = { userId: user._id, role: user.role }
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '7d' })
        return res.json({ token: token })
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

userCltr.login = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const body = req.body
    try {
        const user = await User.findOne({ email: body.email })
        if (!user) {
            return res.status(401).json('email/password wrong')
        }
        const isVerified = bcryptjs.compare(body.password, user.password)
        if (!isVerified) {
            return res.status(401).json('email/password wrong')
        }
        const tokenData = { userId: user._id, role: user.role }
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '7d' })
        return res.json({ token: token })
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

userCltr.profile = async (req, res) => {
    try {
        const user = await User.findById(req.currentUser.userId)
        if (!user) {
            return res.status(404).json('Record not found')
        }
        return res.json(user)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}
export default userCltr