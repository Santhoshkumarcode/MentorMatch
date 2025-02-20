import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAcceptedStudent, getAllMyStudent, getMeetings, rejectStatus, statusUpdate, updateMeeting } from "../redux/slices/meetingScheduleSlice"
import DatePicker from "react-multi-date-picker";
import { Link } from "react-router-dom";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { useNavigate, useParams } from "react-router-dom";
import Chat from "./Chat";
import ReviewForm from "./ReviewForm";

const renderEventContent = (eventInfo) => {
    return (
        <div>
            <b className="font-medium">meeting with - {eventInfo.event.title}</b>
            <p>{new Date(eventInfo.event.start).toLocaleString()}</p>
        </div>
    );
};

export default function MyStudents() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { mentorId } = useParams()
    const { data, acceptedData, meetingDates } = useSelector((state) => state.meetingSchedules);
    const [currentPage, setCurrentPage] = useState('application')
    const [scheduleForm, setScheduleForm] = useState(false)
    const [dates, setDates] = useState([])
    const [chatBox, setChatBox] = useState(false)
    const [meetingId, setMeetingId] = useState()
    const [roomId, setRoomId] = useState('')
    const [showReview, setShowReview] = useState(false)


    // to get all student 
    useEffect(() => {
        if (mentorId) {
            dispatch(getAllMyStudent({ mentorId }))
        }
    }, [mentorId, dispatch])

    // to get accepted students
    useEffect(() => {
        if (mentorId) {
            dispatch(getAcceptedStudent({ mentorId }))
        }
    }, [mentorId, dispatch, data])

    // to get meetigs for the particular mentor
    useEffect(() => {
        if (mentorId) {
            dispatch(getMeetings({ mentorId }))
        }
    }, [mentorId, dispatch])

    const handleAccept = (meetingId) => {
        const confirm = window.confirm('Are you sure want to accept?')
        if (confirm) {
            dispatch(statusUpdate({ meetingId }))
        }
    }

    const handleReject = (meetingId) => {
        const confirm = window.confirm('Are you sure want to reject this student?')
        if (confirm) {
            dispatch(rejectStatus({ meetingId }))
        }
    }

    const handleScheduleSubmit = () => {
        if (!meetingId || dates.length === 0) {
            alert("Please select dates before submitting.");
            return;
        }
        const formattedDates = dates.map(date => new Date(date).toISOString());
        const form = { dates: formattedDates };

        dispatch(updateMeeting({ meetingId, form }))
        dispatch(getMeetings({ mentorId }))
        setScheduleForm(false)
        setDates([])
    }
    const events = meetingDates.map(ele => ({
        title: ele?.title?.username,
        date: ele?.start,
    }))

    const handleJoin = (mentorId, menteeId) => {
        if (!mentorId || !menteeId) {
            alert("Meeting details not found!");
            return;
        }
        navigate(`/meeting-page/${mentorId}/${menteeId}`);
    };

    const handleChat = () => {
        setChatBox((pre) => !pre)
    }

    const handleReview = (id) => {
        console.log(id, mentorId)
        setShowReview((pre) => !pre)
    }

    return (
        <div>

            <div className="flex justify-center space-x-8 border-b border-gray-300 mb-10 shadow-md">
                {["application", "students", "mySchedules"].map((page) => (
                    <p
                        key={page}
                        className={`text-lg font-medium px-4 py-4 cursor-pointer
                ${currentPage === page
                                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                                : "text-gray-600 hover:text-blue-500 hover:border-b-2 hover:border-gray-400"}`}
                        onClick={() => setCurrentPage(page)}
                    >
                        {page === "application" ? "Applications" : page === "students" ? "Students" : "My Schedules"}
                    </p>
                ))}
            </div>

            <div>
                {currentPage === "application" ? (
                    <div className="flex justify-center gap-6 p-6">
                        {data &&
                            data.filter(ele => ele.status === 'pending').map((ele) => (
                                <div className="border border-gray-200 rounded-lg shadow-lg p-6 w-full max-w-xl bg-white" key={ele._id}>
                                    <div className="flex flex-col md:flex-row">
                                        <div className="md:w-1/2 pr-4">

                                            <Link to={`/profile/mentorViewMenteeProfile/${ele?.menteeId?._id}`} className="text-2xl font-bold text-gray-700">
                                                {ele?.menteeId?.username}
                                            </Link>
                                            <p className="text-sm text-gray-600">{ele?.menteeId?.email}</p>
                                            <div className="mt-4 space-y-2 text-gray-700 text-md">
                                                <p>
                                                    <span className="font-semibold">Phone:</span> {ele?.menteeDetails?.phoneNumber}
                                                </p>
                                                <p>
                                                    <span className="font-semibold">LinkedIn:</span>
                                                    <a
                                                        href={ele?.menteeDetails?.linkedIn}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline ml-1"
                                                    >
                                                        Profile
                                                    </a>
                                                </p>
                                                <p>
                                                    <span className="font-semibold">Plan:</span> {ele?.plan}
                                                </p>
                                                <p>
                                                    <span className="font-semibold">Goal:</span> {ele?.mentorshipGoal}
                                                </p>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {ele?.menteeDetails?.skills?.map((skill, index) => (
                                                        <span key={index} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-md">
                                                            {skill.skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pl-4 mt-0">
                                            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-3">Education</h3>
                                            {ele?.menteeDetails?.education?.length > 0 ? (
                                                ele?.menteeDetails?.education.map((edu, index) => (
                                                    <div key={index} className="mb-3">
                                                        <p className="text-md font-semibold">Institute: {edu?.institute}</p>
                                                        <p className="text-md font-semibold">Degree: {edu?.degree}</p>
                                                        <p className="text-md text-gray-700">
                                                            Duration: {edu?.startYear ? new Date(edu.startYear).getFullYear() : "N/A"} - {edu?.endYear ? new Date(edu.endYear).getFullYear() : 'N/A'}
                                                        </p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-600 text-md">No education details provided.</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-center">
                                        <div className="inline-flex rounded space-x-6">
                                            <button
                                                className="px-5 py-2 bg-green-500 text-white font-medium rounded hover:bg-green-600 "
                                                onClick={() => handleAccept(ele._id)}
                                            >
                                                Accept
                                            </button>
                                            <button
                                                className="px-5 py-2 bg-red-500 text-white font-medium rounded hover:bg-red-600"
                                                onClick={() => handleReject(ele._id)}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            ))}
                    </div>

                ) : currentPage === "students" ? (
                    <div className="flex flex-wrap justify-center gap-6 p-6">
                        {acceptedData &&
                            acceptedData.map((ele, i) => (
                                <div key={i} className="border border-gray-200 rounded-lg shadow-lg p-6 w-full max-w-xl bg-white flex flex-col">

                                    <div className="flex flex-col md:flex-row flex-grow">

                                        <div className="md:w-1/2 pr-4">
                                            {ele.profilePic && (
                                                <img src={ele.profilePic} alt="Profile" className="w-20 h-20 rounded-full mb-4" />
                                            )}
                                            <Link to={`/profile/mentorViewMenteeProfile/${ele?.menteeId?._id}`} className="text-2xl font-bold text-gray-700 cursor-pointer">
                                                {ele?.menteeId?.username}
                                            </Link>
                                            <p className="text-sm text-gray-600">{ele?.menteeId?.email}</p>

                                            <div className="mt-4 space-y-2 text-gray-700 text-md">
                                                <p>
                                                    <span className="font-semibold">Phone:</span> {ele?.menteeDetails?.phoneNumber}
                                                </p>
                                                <p>
                                                    <span className="font-semibold">LinkedIn:</span>
                                                    <a
                                                        href={ele?.menteeDetails?.linkedIn}
                                                        target="_blank"
                                                        className="text-blue-600 hover:underline ml-1"
                                                    >
                                                        Profile
                                                    </a>
                                                </p>
                                                <p>
                                                    <span className="font-semibold">Plan:</span> {ele?.plan}
                                                </p>
                                                <p>
                                                    <span className="font-semibold">Goal:</span> {ele?.mentorshipGoal}
                                                </p>
                                                <p>
                                                    <span className="font-semibold">Payment Status:</span>
                                                    <span className={`ml-1 px-2 py-1 text-xs rounded-full 
            ${ele.paymentStatus === 'pending' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                        {ele.paymentStatus}
                                                    </span>
                                                </p>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {ele?.menteeDetails?.skills?.map((skill, index) => (
                                                        <span key={index} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-md">
                                                            {skill.skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* education */}
                                        <div className="md:w-1/2 pl-4 mt-6 md:mt-0 border-l border-gray-300">
                                            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-3">Education</h3>
                                            {ele?.menteeDetails?.education?.length > 0 ? (
                                                ele?.menteeDetails?.education.map((edu, index) => (
                                                    <div key={index} className="mb-3">
                                                        <p className="text-md font-semibold">Institute: {edu?.institute}</p>
                                                        <p className="text-md text-gray-700">
                                                            Duration: {edu?.startYear ? new Date(edu.startYear).getFullYear() : "N/A"} - {edu?.endYear ? new Date(edu.endYear).getFullYear() : 'N/A'}
                                                        </p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-600 text-md">No education details provided.</p>
                                            )}
                                        </div>
                                    </div>

                                    {(() => {
                                        const paymentDate = new Date(ele?.paidDate);
                                        const currentDate = new Date();
                                        const diffInDays = Math.floor((currentDate - paymentDate) / (1000 * 60 * 60 * 24));

                                        if (ele.paymentStatus == 'paid') {
                                            if (diffInDays < 30) {
                                                return (
                                                    <div className="mt-5 flex justify-center">
                                                        <div className="inline-flex rounded-md space-x-6">
                                                            <button
                                                                className="px-5 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600"
                                                                onClick={() => {
                                                                    setScheduleForm(true);
                                                                    setMeetingId(ele._id);
                                                                }}
                                                            >
                                                                Schedule
                                                            </button>
                                                            <button
                                                                className="px-5 py-2 bg-blue-500 rounded text-white font-medium hover:bg-blue-600"
                                                                onClick={() => {
                                                                    handleChat(ele?.mentorId?._id, ele?._id)
                                                                    setRoomId(ele._id)
                                                                }}
                                                            >
                                                                Chat
                                                            </button>
                                                            <button
                                                                className="px-5 py-2 bg-green-500 text-white font-medium rounded hover:bg-green-600 transition"
                                                                onClick={() => handleJoin(ele?.mentorId?._id, ele?.menteeId?._id)}
                                                            >
                                                                Meet
                                                            </button>
                                                        </div>
                                                    </div>
                                                )
                                            } else {
                                                return (
                                                    <button
                                                        className="px-4 py-2 bg-yellow-500 text-white rounded-md shadow-md hover:bg-yellow-600 mt-2"
                                                        onClick={() => handleReview(ele?._id)}>
                                                        Review
                                                    </button>
                                                );
                                            }
                                        }
                                        return null
                                    })()}

                                </div>

                            ))}
                        {scheduleForm && (
                            <div className="fixed inset-0 flex justify-center items-center z-50">
                                <div className="absolute inset-0 bg-black opacity-50"></div>

                                <div className="bg-white p-6 rounded-lg relative z-10 shadow-xl">
                                    <button
                                        onClick={() => setScheduleForm(false)}
                                        className="absolute top-2 right-3 text-gray-600 hover:text-gray-800">
                                        ✖
                                    </button>
                                    <div className="p-4">
                                        <DatePicker
                                            placeholder="Select Dates"
                                            multiple
                                            value={dates}
                                            onChange={setDates}
                                            open={true}
                                        /><br />
                                        <button className="p-2 mt-2 w-full rounded bg-blue-600 text-white hover:bg-blue-700" onClick={handleScheduleSubmit}>
                                            Schedule
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {chatBox && (
                            <Chat isOpen={handleChat} userId={mentorId} meetingId={roomId} />
                            )}
                            {showReview && (
                                <ReviewForm isOpen={handleReview} userId={mentorId} />
                            )}

                    </div>
                ) : currentPage === "mySchedules" ? (
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
                ) : null}
            </div>
        </div>
    )
}