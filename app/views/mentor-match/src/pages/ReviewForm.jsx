import { useState } from "react"
import { useDispatch } from "react-redux"
import { postReview } from "../redux/slices/reviewSlice"

export default function ReviewForm({ isOpen, userId, meetingId }) {

    const dispatch = useDispatch()
    const [form, setForm] = useState({
        reviewText: "",
        rating: "",
        meetingId
    })
    const [clientErrors, setClientErrors] = useState(null)
    const errors = {}


    const runValidation = () => {
        if (form.reviewText.trim().length === 0) {
            errors.reviewText = "Review cannot not be empty"
        }
        if (!form.rating) {
            errors.rating = "Rating cannot be empty"
        }
        return errors
    }


    const handleClick = async (e) => {
        e.preventDefault()

        runValidation()
        if (Object.keys(errors).length > 0) {
            setClientErrors(errors)
        } else {
            try {
                dispatch(postReview({ form }))
            } catch (err) {
                console.log(err)
            }
        }
    }

    return (
        <div class="fixed inset-0 flex justify-center items-center z-50">
            <div class="absolute inset-0 bg-black opacity-50"></div>
            <div class="bg-white p-6 rounded-lg relative z-10 shadow-xl w-full max-w-2xl">
                <button class="absolute top-2 right-3 text-gray-600 hover:text-gray-800"
                    onClick={isOpen}
                >✖</button>
                <p class="text-lg font-semibold mb-2">Leave your review</p>
                <div class="flex flex-col space-y-4">
                    <form onSubmit={handleClick}>
                        <textarea class="w-full p-2 border rounded resize-none h-24"
                            value={form?.reviewText}
                            placeholder="Write your review..."
                            onChange={(e) => { setForm({ ...form, reviewText: e.target.value }) }}
                        ></textarea>
                        {clientErrors && <p className="text-red-500">{clientErrors?.reviewText}</p>}
                        <div>
                            <label class="block text-gray-700 mb-1">Rating:</label>
                            <select class="w-full p-2 border rounded"
                                value={form?.rating}
                                onChange={(e) => { setForm({ ...form, rating: e.target.value }) }}>
                                <option value="">Rating</option>
                                <option value="5">5</option>
                                <option value="4">4</option>
                                <option value="3">3</option>
                                <option value="2">2</option>
                                <option value="1">1</option>
                            </select>
                            {clientErrors && <p className="text-red-500">{clientErrors?.rating}</p>}
                        </div>
                        <div class="flex justify-end">
                            <input class="bg-blue-500 text-white px-4 text-center mt-2 py-2 rounded hover:bg-blue-600"
                                type="submit"
                                value="send" />
                        </div>
                    </form>
                </div>
            </div>
        </div>


    )
}