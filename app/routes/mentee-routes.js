import express from "express"
import menteeCltr from "../controllers/mentee-cltr.js"

import { authentication } from "../middlewares/authentication.js"
import authorizeUser from "../middlewares/authorizeUser.js"

const router = express.Router()

router.put('/mentees/:id', authentication, authorizeUser(['mentee']), menteeCltr.updateMentee)
router.put('/mentees/update/profilePic/:id', authentication, authorizeUser(['mentee']), menteeCltr.updateProfilePic)

router.get('/mentees/profile/:id', authentication, menteeCltr.getProfile)
router.get('/mentees',authentication,menteeCltr.getAll)


export default router

