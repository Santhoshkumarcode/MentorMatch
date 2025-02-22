import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { deleteMentor, isVerified, fetchAllMentors } from "../redux/slices/mentorSlice"
import { getAllMentee } from "../redux/slices/menteeSlice"

export default function AdminDashboard() {

    const dispatch = useDispatch()

    const mentors = useSelector((state) => state?.mentors?.data);
    const allMentees = useSelector((state) => state?.mentees?.allMentees);

    const [currentPage, setCurrentPage] = useState('application')

    useEffect(() => {
        dispatch(getAllMentee())
    }, [dispatch, mentors])

    useEffect(() => {
        dispatch(fetchAllMentors())
    }, [dispatch])

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
            <div className="flex justify-center space-x-8 border-b border-gray-300 mb-10 shadow-md">
                {["application", "analytics", "revenue"].map((page) => (
                    <p
                        key={page}
                        className={`text-lg font-medium px-4 py-4 cursor-pointer
                ${currentPage === page
                                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                                : "text-gray-600 hover:text-blue-500 hover:border-b-2 hover:border-gray-400"}`}
                        onClick={() => setCurrentPage(page)}
                    >
                        {page === "application" ? "Applications" : page === "analytics" ? "Analytics" : "Revenue"}
                    </p>
                ))}
            </div>

            {currentPage == 'application' ? (
                <div className="grid lg:grid-cols-2 gap-8 p-6">
                    {mentors ? (
                        mentors.filter(ele => ele.isVerified == false).map((mentor) => (
                            <div
                                key={mentor._id}
                                className="bg-gray-50 p-4 shadow-md border border-gray-300 rounded-lg">
                                <h2 className="text-xl font-bold"></h2>
                                <p className="text-gray-700 m-2 mb-4"><span className="text-3xl font-semibold">{mentor?.userId?.username}</span></p>
                                <p className="text-gray-700 m-2"><span className="text-lg font-semibold">Email:</span> <span className="text-lg">{mentor?.userId?.email}</span></p>
                                <p className="text-gray-700 m-2"><span className="text-lg font-semibold">Company Name:</span> <span className="text-lg">{mentor?.companyName}</span></p>
                                <p className="text-gray-700 m-2"><span className="text-lg font-semibold">Job Title:</span> <span className="text-lg">{mentor?.jobTitle}</span></p>
                                <p className="text-gray-700 m-2"><span className="text-lg font-semibold">phone Number:</span> <span className="text-lg">{mentor?.phoneNumber}</span></p>

                                <p className="text-blue-600 underline text-lg"><a href={mentor?.linkedIn} target="_blank">LinkedIn</a></p>
                                <p className="text-blue-600 underline text-lg"><a href={mentor?.personalWebsite} target="_blank">personalWebsite</a></p>
                                <br />
                                <button className="bg-green-500 px-10 py-2 rounded-xs hover:text-white mr-5 hover:cursor-pointer" onClick={() => { handleAccept(mentor?.userId?._id) }}>Accept</button>
                                <button className="bg-red-500 px-10 py-2 rounded-xs hover:text-white hover:cursor-pointer" onClick={() => { handleReject(mentor?.userId?._id) }}>Reject</button>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-600 col-span-full">
                            No mentors available.
                        </p>
                    )}
                </div>
            ) : currentPage == "analytics" ? (
                <div className="grid grid-cols-2  gap-4 mb-6">
                    <div className="bg-white border border-gray-300 shadow-lg rounded-lg p-6 flex flex-col items-center">
                        <p className="text-lg font-semibold text-gray-600">Total Mentees</p>
                        <p className="text-3xl font-bold text-blue-600 mt-2">{allMentees.length}</p>
                    </div>
                    <div className="bg-white border border-gray-300 shadow-lg rounded-lg p-6 flex flex-col items-center">
                        <p className="text-lg font-semibold text-gray-600">Total Mentors</p>
                        <p className="text-3xl font-bold text-green-600 mt-2">{mentors.length}</p>
                    </div>
                </div>

            ) : currentPage == 'revenue' ? (
                <div>
                    revenue
                </div>
            ) : null}

        </div>

    )
}