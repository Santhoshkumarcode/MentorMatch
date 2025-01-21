import express from "express"
import menteeCltr from "../controllers/Mentee-cltr.js"

import { authentication } from "../middlewares/authentication.js"

const router = express.Router()

router.put('/mentees/:id', menteeCltr.updateMentee)
router.get('/mentees/profile',authentication,menteeCltr.getProfile)

export default router

