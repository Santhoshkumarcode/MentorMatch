import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getMenteeBookings } from "../redux/slices/meetingScheduleSlice"
import { useNavigate, useParams } from "react-router-dom"

export default function () {

    const { menteeBookings } = useSelector((state) => state?.meetingSchedules)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [currentPage, setCurrentPage] = useState('myBookings')
    const { menteeId } = useParams()

    useEffect(() => {
        dispatch(getMenteeBookings({ menteeId }))
    }, [menteeId, dispatch, menteeBookings])


    const handleJoin = (mentorId, menteeId) => {
        if (!mentorId || !menteeId) {
            alert("Meeting details not found!");
            return;
        }
        navigate(`/meeting-page/${mentorId}/${menteeId}`)
    }

    return (
        <div>
            <div>
                <div className="text-center">
                    <div className="flex justify-center space-x-8 border-b border-gray-300 mb-10">
                        {["myBookings", "meetingSummary"].map((page) => (
                            <p
                                key={page}
                                className={`text-lg font-medium px-4 py-4 cursor-pointer
                ${currentPage === page
                                        ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                                        : "text-gray-600 hover:text-blue-500 hover:border-b-2 hover:border-gray-400"}`}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page === "myBookings" ? "My Bookings" : "Meeting Summary"}
                            </p>
                        ))}
                    </div>
                    {currentPage == 'myBookings' ? (
                        <div className="flex flex-wrap justify-center gap-6 p-6">
                            {menteeBookings &&
                                menteeBookings.map((ele) => (
                                    <div key={ele._id} className="border border-gray-200 rounded-lg shadow-lg p-6 w-full max-w-md bg-white text-left">

                                        <p className="text-2xl font-bold text-gray-900">{ele?.mentorId?.username}</p>
                                        <p className="text-sm text-gray-600">{ele?.mentorId?.email}</p>

                                        <div className="mt-4 space-y-2 text-gray-700 text-sm">
                                            <p><span className="font-semibold">Plan:</span> {ele?.plan}</p>
                                            <p><span className="font-semibold">Status:</span> {ele?.status}</p>
                                            <p><span className="font-semibold">Payment:</span>
                                                <span className={`ml-1 px-2 py-1 text-xs rounded-full 
                            ${ele.paymentStatus === 'pending' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                    {ele.paymentStatus}
                                                </span>
                                            </p>
                                        </div>

                                        <div className="mt-5 flex justify-between">
                                            <button
                                                className={`px-4 py-2 text-white rounded-md shadow-md transition 
                            ${ele.paymentStatus === 'pending' ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'}`}
                                                disabled={ele.paymentStatus === 'paid'}>
                                                {ele.paymentStatus === 'pending' ? 'Pay Now' : 'Paid'}
                                            </button>

                                            {ele.paymentStatus === 'paid' && (
                                                <div className="flex space-x-3">
                                                    <button className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition">
                                                        Message
                                                    </button>
                                                    <button className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition"
                                                        onClick={() => handleJoin(ele?.mentorId?._id, menteeId)}>
                                                        Meet
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                        </div>

                    ) : (
                        <div>
                            meeting summary
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}