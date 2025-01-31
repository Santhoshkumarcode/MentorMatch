import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { deleteMentor, fetchAllMentors, isVerified } from "../redux/slices/mentorSlice"

export default function AdminDashboard() {

    const { data } = useSelector((state) => state.mentors)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchAllMentors())
    }, [dispatch, data])

    const handleAccept = (userId) => {
        const confirm = window.confirm("Are you sure want to allow this mentor?")
        if (confirm) {
            dispatch(isVerified({ userId }))
        }
    }

    const handleReject = (userId) => {
        const confirm = window.confirm("Are you sure want to delete this mentor?")
        if (confirm) {
            dispatch(deleteMentor({ userId }))
        }
    }

    return (
        <div>
            <div className="text-center">
                <h1 className="text-3xl m-8">Mentors</h1>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 p-6">
                {data ? (
                    data.filter(ele => ele.isVerified == false).map((mentor) => (
                        <div
                            key={mentor._id}
                            className="bg-gray-50 p-4 shadow-md border border-gray-300 rounded-lg">
                            <h2 className="text-xl font-bold"></h2>
                            <p className="text-gray-700 m-2 mb-4"><span className="text-3xl font-semibold">{mentor.userId.username}</span></p>
                            <p className="text-gray-700 m-2"><span className="text-lg font-semibold">Email:</span> <span className="text-lg">{mentor.userId.email}</span></p>
                            <p className="text-gray-700 m-2"><span className="text-lg font-semibold">Company Name:</span> <span className="text-lg">{mentor.companyName}</span></p>
                            <p className="text-gray-700 m-2"><span className="text-lg font-semibold">Job Title:</span> <span className="text-lg">{mentor.jobTitle}</span></p>
                            <p className="text-gray-700 m-2"><span className="text-lg font-semibold">phone Number:</span> <span className="text-lg">{mentor.phoneNumber}</span></p>

                            <p className="text-blue-600 underline text-lg"><a href={mentor.linkedIn} target="_blank">LinkedIn</a></p>
                            <p className="text-blue-600 underline text-lg"><a href={mentor.personalWebsite} target="_blank">personalWebsite</a></p>
                            <br />
                            <button className="bg-green-500 px-10 py-2 rounded-xs hover:text-white mr-5 hover:cursor-pointer" onClick={() => { handleAccept(mentor.userId._id) }}>Accept</button>
                            <button className="bg-red-500 px-10 py-2 rounded-xs hover:text-white hover:cursor-pointer" onClick={() => { handleReject(mentor.userId._id) }}>Reject</button>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-600 col-span-full">
                        No mentors available.
                    </p>
                )}
            </div>
        </div>

    )
}