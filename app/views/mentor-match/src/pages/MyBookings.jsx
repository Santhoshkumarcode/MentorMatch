import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate, useParams } from "react-router-dom"
import { getMenteeBookings } from "../redux/slices/meetingScheduleSlice"
import { getMeetingsOfMentee } from "../redux/slices/meetingScheduleSlice"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import Chat from "./Chat"

const renderEventContent = (eventInfo) => {
    return (
        <div>
            <b className="font-medium">meeting with - {eventInfo.event.title}</b>
            <p>{new Date(eventInfo.event.start).toLocaleString()}</p>
        </div>
    );
};

export default function MyBookings() {

    const { menteeBookings } = useSelector((state) => state?.meetingSchedules)
    const { menteeMeetingDates } = useSelector((state) => state.meetingSchedules)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [chatBox, setChatBox] = useState(false)
    const [currentPage, setCurrentPage] = useState('myBookings')
    const[roomId,setRoomId] = useState('')

    const { menteeId } = useParams()



    const events = menteeMeetingDates.map(ele => ({
        title: ele?.title?.username,
        date: ele?.start,
    }))

    useEffect(() => {
        dispatch(getMenteeBookings({ menteeId }))
    }, [menteeId, dispatch])

    useEffect(() => {
        if (menteeId) {
            dispatch(getMeetingsOfMentee({ menteeId }))
        }
    }, [dispatch, menteeId])

    const handleJoin = (mentorId, menteeId) => {
        if (!mentorId || !menteeId) {
            alert("Meeting details not found!");
            return;
        }
        navigate(`/meeting-page/${mentorId}/${menteeId}`)
    }

    const handleChat = () => {
        setChatBox((pre) => !pre)
    }
    if (!menteeId) {
        return <p>loading</p>
    }

    return (
        <div>
            <div>
                <div className="text-center shadow">
                    <div className="flex justify-center space-x-8 border-b border-gray-300 mb-10">
                        {["myBookings", "meetingSummary", "meetingDates"].map((page) => (
                            <p
                                key={page}
                                className={`text-lg font-medium px-4 py-4 cursor-pointer
                ${currentPage === page
                                        ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                                        : "text-gray-600 hover:text-blue-500 hover:border-b-2 hover:border-gray-400"}`}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page === "myBookings" ? "My Bookings" : page == "meetingSummary" ? "Meeting Summary" : "Meeting Dates"}
                            </p>
                        ))}
                    </div>
                    {currentPage == 'myBookings' ? (
                        <div className="flex flex-wrap justify-center gap-6 p-6">
                            {menteeBookings &&
                                menteeBookings.map((ele) => (
                                    <div key={ele._id} className="border border-gray-200 rounded-lg shadow-lg p-6 w-full max-w-md bg-white text-left">
                                        <Link to={`/mentor-profile/${ele?.mentorId._id}`}><p className="text-2xl font-bold text-gray-900">{ele?.mentorId?.username}</p></Link>
                                        <p className="text-sm text-gray-600">{ele?.mentorId?.email}</p>

                                        <div className="mt-4 space-y-2 text-gray-700 text-md">
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
                                                    <button className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition"
                                                        onClick={() => {
                                                            handleChat(ele?.mentorId?._id, ele?.menteeId?._id)
                                                            setRoomId(ele._id)
                                                        }}>
                                                        Chat
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
                    ) : currentPage == 'meetingSummary' ? (
                        <div>
                            meeting summary
                        </div>
                    ) : (
                        <div className=" w-full p-4 border border-gray-300 rounded-lg">
                            <FullCalendar
                                plugins={[dayGridPlugin]}
                                initialView='dayGridMonth'
                                weekends={true}
                                events={events}
                                eventContent={renderEventContent}
                                height="500px"
                            />
                        </div>
                    )}

                </div>
                {chatBox && (
                    <Chat isOpen={handleChat} userId={menteeId} meetingId={roomId}/>
                )}
                {/*                 {chatBox && (
                    <div>
                        <div className="fixed inset-0 flex justify-center items-center z-50">
                            <div className="absolute inset-0 bg-black opacity-50"></div>

                            <div className="bg-white p-6 rounded-lg relative z-10 shadow-xl w-96 h-80">
                                <button
                                    onClick={() => setChatBox(false)}
                                    className="absolute top-2 right-3 text-gray-600 hover:text-gray-800">
                                    ✖
                                </button>
                                <div className="flex flex-col h-full">
                                    <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                                        <div className="flex justify-start">
                                            <div className="bg-blue-500 text-white p-2 rounded-lg max-w-xs">
                                                <p>Hello, how can I help you today?</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <div className="bg-green-500 text-white p-2 rounded-lg max-w-xs">
                                                <p>I need assistance with my project.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none"
                                            placeholder="Type a message"
                                        />
                                        <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                                            send
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )} */}
            </div>
        </div>
    )
}