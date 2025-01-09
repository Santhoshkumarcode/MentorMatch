import express from "express"
import mentorCltr from "../controllers/mentor-cltr.js";

import { authentication } from "../middlewares/authentication.js";

const router = express.Router()

router.post('/mentors', authentication, mentorCltr.createMentor)
router.put('/mentors/:id',authentication,mentorCltr.updateMentor)

export default router