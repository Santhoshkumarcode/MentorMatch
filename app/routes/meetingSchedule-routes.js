import express from "express"
import meeting from "../controllers/meetingSchedule-cltr.js";

import { authentication } from "../middlewares/authentication.js";

const router = express.Router()

router.post('/meetings', authentication, meeting.requestMeeting)
router.get('/meetings/:mentorId', authentication, meeting.respondToRequest)
router.put('/meetings/:mentorId') // mentor accept or reject booking
router.put('/meetings:mentorId/schedule') // mentor can schedule time date

export default router