import express from "express"
import mentorCltr from "../controllers/mentor-cltr.js";

import { authentication } from "../middlewares/authentication.js";

const router = express.Router()

router.post('/mentor',authentication, mentorCltr.createMentor)

export default router