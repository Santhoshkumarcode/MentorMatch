import express from "express"
import mentorCltr from "../controllers/mentor-cltr.js";

import { authentication } from "../middlewares/authentication.js";
import authorizeUser from "../middlewares/authorizeUser.js";

const router = express.Router()

router.post('/mentors', authentication, authorizeUser(['mentor']), mentorCltr.createMentor)
router.put('/mentors/:id', authentication, authorizeUser(['mentor']), mentorCltr.updateMentor)
router.get('/mentors/all', authentication, authorizeUser(['admin']), mentorCltr.getAll)
router.get('/mentors', mentorCltr.getVerified)
router.get('/mentors/profile', authentication, mentorCltr.getProfile)
router.delete('/mentors/:id', authentication, authorizeUser(['admin','mentor']), mentorCltr.deleteProfile)

export default router