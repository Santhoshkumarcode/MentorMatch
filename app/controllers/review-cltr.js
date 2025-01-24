import Meeting from "../models/meeting-schedule-model.js"
import Review from "../models/review-model.js"
import _ from "lodash"

const reviewCltr = {}

// reviewCltr.createReview = async (req, res) => {

//     const { reviewerId, revieweeId, rating, reviewText } = _.pick(req.body, ["revieweeId", "rating", "reviewText"]);

//     if (reviewerId === revieweeId) {
//         return res.status(400).json("You cannot review yourself.");
//     }
//     try {
//         const existingReview = await Review.findOne({ reviewerId, revieweeId });
//         if (existingReview) {
//             return res.status(400).json("You have already reviewed this user.");
//         }

//         const review = await Review.create({ reviewerId:req.currentUser.userId, revieweeId, rating, reviewText })
//         return res.status(201).json(review)
//     } catch (err) {
//         console.log(err)
//         return res.status(500).json(err)
//     }
// }

//


reviewCltr.getMentorReviews = async (req, res) => {
    const { mentorId } = req.query
    console.log(mentorId)
    try {
        const reviews = await Review
            .find({ revieweeId: mentorId, reviewee: 'mentor' })
            .populate('reviewerId')
            .populate('meetingId')

        if (!reviews || reviews.length === 0) {
            return res.status(404).json("No reviews found for this mentor");
        }
        return res.status(200).json(reviews)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

reviewCltr.getMenteeReviews = async (req, res) => {
    const { menteeId } = req.query
    try {
        const reviews = await Review
            .find({ revieweeId: menteeId, reviewee: 'mentee' })
            .populate('reviewerId')
            .populate('meetingId')
        if (!reviews || reviews.length === 0) {
            return res.status(404).json("No reviews found for this mentee");
        }
        return res.status(200).json(reviews)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

reviewCltr.createReview = async (req, res) => {
    const { meetingId, rating, reviewText } = req.body
    try {
        const reviewer = req.currentUser.role == 'mentor' ? 'mentor' : 'mentee'
        const reviewee = req.currentUser.role == 'mentor' ? 'mentee' : 'mentor'
        const reviewerId = req.currentUser.userId

        const meeting = await Meeting.findById(meetingId)
        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }
        const revieweeId = reviewer === 'mentee' ? meeting.mentorId : meeting.menteeId;

        const review = new Review({
            reviewerId,
            revieweeId,
            reviewee,
            reviewer,
            meetingId,
            rating,
            reviewText
        })
        console.log(review)
        await review.save()
        return res.status(200).json(review)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

reviewCltr.getReviews = async (req, res) => {
    const id = req.params.id
    try {
        const review = await Review.find({})
        console.log(review)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}
export default reviewCltr