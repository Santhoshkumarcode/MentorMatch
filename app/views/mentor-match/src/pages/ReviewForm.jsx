import { useState } from "react"

export default function ReviewForm({ isOpen, userId }) {

    const [form, setForm] = useState({
        reviewText: "",
        ratings: ""
    })


    const handleClick = (e) => {
        e.preventDefault()
        console.log(form, userId)
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
                        <textarea class="w-full p-2 border rounded resize-none h-24" placeholder="Write your review..."
                            onChange={(e) => { setForm({ ...form, reviewText: e.target.value }) }}
                        ></textarea>
                        <div>
                            <label class="block text-gray-700 mb-1">Rating:</label>
                            <select class="w-full p-2 border rounded" onChange={(e) => { setForm({ ...form, ratings: e.target.value }) }}>
                                <option value="5">5</option>
                                <option value="4">4</option>
                                <option value="3">3</option>
                                <option value="2">2</option>
                                <option value="1">1</option>
                            </select>
                        </div>
                        <div class="flex justify-end">
                            <input class="bg-blue-500 text-white px-4 text-center mt-2 py-2 rounded hover:bg-blue-600" type="submit" value="send"/>
                        </div>
                    </form>
                </div>
            </div>
        </div>


    )
}