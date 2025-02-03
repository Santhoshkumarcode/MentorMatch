import express from "express"
import menteeCltr from "../controllers/Mentee-cltr.js"

import { authentication } from "../middlewares/authentication.js"
import authorizeUser from "../middlewares/authorizeUser.js"

const router = express.Router()

router.put('/mentees/:id', authentication, authorizeUser(['mentee']), menteeCltr.updateMentee)
router.get('/mentees/profile/:id', authentication, menteeCltr.getProfile)


export default router

