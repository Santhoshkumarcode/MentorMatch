import express from "express"
import meeting from "../controllers/meetingSchedule-cltr.js";
import multer from "multer";
import path from "path"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage })

import { authentication } from "../middlewares/authentication.js";
import authorizeUser from "../middlewares/authorizeUser.js";

const router = express.Router()

router.post('/meetings', authentication, authorizeUser(['mentee']), meeting.requestMeeting)
router.get('/meetings/request/:mentorId', authentication, authorizeUser(['mentor']), meeting.respondToRequest)
router.get('/meetings/scheduled/:mentorId', authentication, authorizeUser(['mentor']), meeting.getacceptedStudents)
router.get('/meetings/mentor/:mentorId', authentication, meeting.getMeetingDates)
router.put('/meetings/:meetingId', authentication, meeting.statusUpdate)
router.put('/meetings/transcript/:meetingId', upload.single('audio'), authentication, meeting.meetingTranscript)
router.get('/meetings/:meetingId', authentication, meeting.getMeetingDetails)
router.get('/meetings/mentee/:menteeId', authentication, authorizeUser(['mentee']), meeting.getBookingsOfMentee)
router.delete('/meetings/:meetingId', authentication, authorizeUser(['admin', 'mentor']), meeting.deleteMeeting)
// router.put('/meetings/:meetingId/schedule') // mentor can schedule time date

export default router