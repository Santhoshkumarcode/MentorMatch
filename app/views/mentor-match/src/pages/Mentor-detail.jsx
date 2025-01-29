import { useState } from "react";
// import jwt_decode from "jwt-decode";

export default function () {

    const [form, setForm] = useState({
        companyName: '',
        jobTitle: '',
        linkedIn: '',
        personalWebsite: '',
        phoneNumber: '',
        experience: []
    })

    /* const decoded = jwt_decode(localStorage.getItem('token'))
    const userId = decoded.id
    console.log(userId) */

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(form)
    }
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
                <h1 className="text-2xl text-gray-800 mb-6 text-center font-semibold">Apply to be a Mentor</h1>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="flex space-x-4">
                        <div className="w-full">
                            <input
                                type="text"
                                placeholder="Enter Company Name"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                            />
                        </div>
                        <div className="w-full">
                            <input
                                type="text"
                                placeholder="Enter Job Title"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex space-x-4">
                        <div className="w-full">
                            <input
                                type="text"
                                placeholder="Enter LinkedIn URL"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                onChange={(e) => setForm({ ...form, linkedIn: e.target.value })}
                            />
                        </div>
                        <div className="w-full">
                            <input
                                type="text"
                                placeholder="Enter Personal Website URL"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                onChange={(e) => setForm({ ...form, personalWebsite: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex space-x-4">
                        <div className="w-full">
                            <input
                                type="number"
                                placeholder="Phone Number"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                            />
                        </div>
                        <div className="w-full">
                            <input
                                type="text"
                                placeholder="Experiences"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                onChange={(e) => setForm({ ...form, experience: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="text-center">
                        <input
                            type="submit"
                            value="Apply as Mentor"
                            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 cursor-pointer"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
