import Meeting from "../models/meeting-schedule-model.js"
import Review from "../models/review-model.js"
import _ from "lodash"

const reviewCltr = {}

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
        const review = await Review.find({ revieweeId: id }).populate('reviewerId').populate('revieweeId')
        if (!review) {
            return res.status(404).json('No review for you')
        }
        return res.status(200).json(review)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

export default reviewCltr