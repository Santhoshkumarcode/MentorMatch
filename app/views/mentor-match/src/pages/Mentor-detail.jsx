import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateMentor } from "../redux/slices/mentorSlice";
import { useNavigate } from "react-router-dom";

const initialState = {
    companyName: '',
    jobTitle: '',
    linkedIn: '',
    personalWebsite: '',
    phoneNumber: '',
}

export default function MentorDetail() {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { data } = useSelector((state) => state.users)
    const [form, setForm] = useState(initialState)
    const [clientErrors, setClientErrors] = useState(null)
    const errors = {}

    const runClientValidation = () => {
        if (form.companyName.trim().length === 0) {
            errors.companyName = "Company name required."
        }
        if (form.jobTitle.trim().length === 0) {
            errors.jobTitle = "Job title required"
        }
        if (form.linkedIn.trim().length === 0) {
            errors.linkedIn = "Linkedin url required"
        }
        if (form.personalWebsite.trim().length === 0) {
            errors.personalWebsite = "Personal website url required"
        }
        if (form.phoneNumber.trim().length === 0) {
            errors.phoneNumber = "Phone number required"
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        runClientValidation()

        if (!data || !data._id) {
            console.error("id missing");
            return;
        }

        if (Object.keys(errors).length !== 0) {
            setClientErrors(errors)
            return
        } else {
            try {
                const resetForm = () => {
                    setForm(initialState);
                };
                await dispatch(updateMentor({ userId: data._id, form, resetForm })).unwrap()
                navigate('/')
            } catch (err) {
                console.log(err)
            }

        }
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
                                placeholder="Enter Company Name and Posotion"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                onChange={(e) => {
                                    setForm({ ...form, companyName: e.target.value });
                                    setClientErrors((pre) => ({ ...pre, companyName: '' }))
                                }}
                            />
                            {clientErrors && <p className="text-sm text-red-500 mt-1">{clientErrors.companyName}</p>}
                        </div>
                        <div className="w-full">
                            <input
                                type="text"
                                placeholder="Enter Job Title"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                onChange={(e) => {
                                    setForm({ ...form, jobTitle: e.target.value });
                                    setClientErrors((pre) => ({ ...pre, jobTitle: '' }))
                                }}
                            />
                            {clientErrors && <p className="text-sm text-red-500 mt-1">{clientErrors.jobTitle}</p>}
                        </div>
                    </div>

                    <div className="flex space-x-4">
                        <div className="w-full">
                            <input
                                type="text"
                                placeholder="Enter LinkedIn URL"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                onChange={(e) => {
                                    setForm({ ...form, linkedIn: e.target.value });
                                    setClientErrors((pre) => ({ ...pre, linkedIn: '' }))
                                }}
                            />
                            {clientErrors && <p className="text-sm text-red-500 mt-1">{clientErrors.linkedIn}</p>}
                        </div>
                        <div className="w-full">
                            <input
                                type="text"
                                placeholder="Enter Personal Website URL"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                onChange={(e) => {
                                    ;
                                    setForm({ ...form, personalWebsite: e.target.value });
                                    setClientErrors((pre) => ({ ...pre, personalWebsite: '' }))
                                }}
                            />
                            {clientErrors && <p className="text-sm text-red-500 mt-1">{clientErrors.personalWebsite}</p>}
                        </div>
                    </div>

                    <div className="flex space-x-4">
                        <div className="w-full">
                            <input
                                type="number"
                                placeholder="Phone Number"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                onChange={(e) => {
                                    setForm({ ...form, phoneNumber: e.target.value });
                                    setClientErrors((pre) => ({ ...pre, phoneNumber: '' }))
                                }}
                            />
                            {clientErrors && <p className="text-sm text-red-500 mt-1">{clientErrors.phoneNumber}</p>}
                        </div>

                    </div>

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
