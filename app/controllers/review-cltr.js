import Review from "../models/review-model.js"
import _ from "lodash"

const reviewCltr = {}

reviewCltr.createReview = async (req, res) => {

    const details = _.pick(req.body, ["reviewerId", "revieweeId", "rating", "reviewText"])
    try {
        const review = await Review.create(details)
        return res.status(201).json(review)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

reviewCltr.getMentorReview = async (req, res) => {
    const { mentorId } = req.query
    try {
        const reviews = await Review.find({ revieweeId: mentorId })
        if (!reviews || reviews.length === 0) {
            return res.status(404).json("No reviews found for this mentor");
        }
        return res.status(200).json(reviews)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

reviewCltr.getMenteeReview = async (req, res) => {
    const { menteeId } = req.query
    try {
        const reviews = await Review.find({ revieweeId: menteeId })
        if (!reviews || reviews.length === 0) {
            return res.status(404).json("No reviews found for this mentee");
        }
        return res.status(200).json(reviews)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}
export default reviewCltr