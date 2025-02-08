import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getMenteeBookings } from "../redux/slices/meetingScheduleSlice"
import { useNavigate } from "react-router-dom"

export default function () {

    const { data } = useSelector((state) => state?.users)
    const { menteeBookings } = useSelector((state) => state?.meetingSchedules)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const menteeId = data?._id

    useEffect(() => {
        dispatch(getMenteeBookings({ menteeId }))
    }, [menteeId, dispatch, menteeBookings])

    if (!data) {
        return <p>loading</p>
    }
    const handleJoin = (mentorId,menteeId) => {
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
                    <h1 className="text-3xl m-8">My-Bookings</h1>
                    <div className="flex space-x-10 justify-center">
                        {menteeBookings &&
                            menteeBookings.map((ele) => (
                                <div className="border text-left border-gray-300 rounded-lg shadow-md p-6 w-full max-w-md bg-white" key={ele._id}>
                                    <p className="text-lg font-semibold text-gray-800">mentor username: {ele?.mentorId?.username}</p>
                                    <p className="text-lg font-semibold text-gray-800">mentor Email: {ele?.mentorId?.email}</p>
                                    <p className="text-base text-gray-600">Plan: {ele?.plan}</p>
                                    <p className="text-base text-gray-600 mb-4">status: {ele?.status}</p>
                                    <div className="flex gap-4">

                                        <button
                                            className={`px-4 py-2 text-white rounded-md 
                                            ${ele.paymentStatus === 'pending' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 cursor-not-allowed'}`}
                                            disabled={ele.paymentStatus === 'paid'}>
                                            {ele.paymentStatus === 'pending' ? 'Pay Now' : 'Paid'}
                                        </button>
                                        {ele.paymentStatus == 'paid' && (
                                            <div className="space-x-4">
                                                <button className="px-4 py-2 bg-blue-500  text-white rounded-md hover:bg-blue-600">Message</button>
                                                <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600" onClick={() => { handleJoin(ele?.mentorId?._id,menteeId) }}>Meet</button>
                                            </div>
                                        )}


                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    )
}