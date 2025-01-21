import express from "express"
import reviewCltr from "../controllers/review-cltr.js";

import { authentication } from "../middlewares/authentication.js";

const router = express.Router()

router.post('/reviews', authentication, reviewCltr.createReview)
router.get('/reviews/mentors', reviewCltr.getMentorReview)
router.get('/reviews/mentees',reviewCltr.getMenteeReview)
export default router