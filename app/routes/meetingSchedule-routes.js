import express from "express"
import meeting from "../controllers/meetingSchedule-cltr.js";

import { authentication } from "../middlewares/authentication.js";
import authorizeUser from "../middlewares/authorizeUser.js";

const router = express.Router()

router.post('/meetings', authentication, meeting.requestMeeting)
router.get('/meetings/request/:mentorId', authentication, meeting.respondToRequest)
router.put('/meetings/:meetingId', authentication, meeting.statusUpdate)
router.get('/meetings/:meetingId', authentication, meeting.getMeetingDetails)
router.get('/meetings/mentee/:menteeId', authentication, authorizeUser(['mentee']), meeting.getBookingsOfMentee)
router.delete('/meetings/:meetingId', authentication, authorizeUser(['admin', 'mentor']), meeting.deleteMeeting)
// router.put('/meetings/:meetingId/schedule') // mentor can schedule time date

export default router