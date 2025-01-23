import express from "express"
import reviewCltr from "../controllers/review-cltr.js";

import { authentication } from "../middlewares/authentication.js";
import authorizeUser from "../middlewares/authorizeUser.js";

const router = express.Router()

router.post('/reviews', authentication, authorizeUser(['mentor', 'mentee']), reviewCltr.createReview)
router.get('/reviews/',authentication,reviewCltr.getReviews)
// router.get('/reviews/mentors', reviewCltr.getMentorReview)
// router.get('/reviews/mentees', reviewCltr.getMenteeReview)

export default router