import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAcceptedStudent, getAllMyStudent, getMeetings, rejectStatus, statusUpdate, updateMeeting } from "../redux/slices/meetingScheduleSlice"
import DatePicker from "react-multi-date-picker";

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { useNavigate, useParams } from "react-router-dom";

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

    const handleChat = (mentorId, menteeId) => {
        setChatBox(true)
    }

    return (
        <div>

            <div className="flex justify-center space-x-8 border-b border-gray-300 mb-10">
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
                                <div className="border border-gray-200 rounded-lg shadow-lg p-6 w-full max-w-sm bg-white flex flex-col text-left" key={ele._id}>

                                    <p className="text-2xl font-bold text-gray-900">{ele?.menteeId?.username}</p>
                                    <p className="text-sm text-gray-600">{ele?.menteeId?.email}</p>

                                    <div className="mt-4 space-y-2 text-gray-700 text-sm">
                                        <p><span className="font-semibold">Phone:</span> {ele?.menteeDetails?.phoneNumber}</p>
                                        <p>
                                            <span className="font-semibold">LinkedIn:</span>
                                            <a href={ele?.menteeDetails?.linkedIn} target="_blank" className="text-blue-600 hover:underline ml-1">Profile</a>
                                        </p>
                                        <p><span className="font-semibold">Plan:</span> {ele?.plan}</p>
                                        <p><span className="font-semibold">Goal:</span> {ele?.mentorshipGoal}</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {ele?.menteeDetails?.skills?.map((skill, index) => (
                                                <span key={index} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-md">
                                                    {skill.skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-5 flex justify-between">
                                        <button className="bg-green-500 text-white px-5 py-2 rounded-md shadow-md hover:bg-green-600 transition" onClick={() => { handleAccept(ele._id) }}>
                                            Accept
                                        </button>
                                        <button className="bg-red-500 text-white px-5 py-2 rounded-md shadow-md hover:bg-red-600 transition" onClick={() => { handleReject(ele._id) }}>
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>

                ) : currentPage === "students" ? (
                    <div className="flex flex-wrap justify-center gap-6 p-6">
                        {acceptedData &&
                            acceptedData.map((ele, i) => (
                                <div key={i} className="border border-gray-200 rounded-lg shadow-lg p-6 w-full max-w-md bg-white flex flex-col text-left">
                                    <img src={ele.profilePic} />
                                    <p className="text-2xl font-bold text-gray-900">{ele?.menteeId?.username}</p>
                                    <p className="text-sm text-gray-600">{ele?.menteeId?.email}</p>

                                    <div className="mt-4 space-y-2 text-gray-700 text-md">
                                        <p><span className="font-semibold">Phone:</span> {ele?.menteeDetails?.phoneNumber}</p>
                                        <p>
                                            <span className="font-semibold">LinkedIn:</span>
                                            <a href={ele?.menteeDetails?.linkedIn} target="_blank" className="text-blue-600 hover:underline ml-1">Profile</a>
                                        </p>
                                        <p><span className="font-semibold">Plan:</span> {ele?.plan}</p>
                                        <p><span className="font-semibold">Goal:</span> {ele?.mentorshipGoal}</p>
                                        <p><span className="font-semibold">Payment Status:</span> {ele?.paymentStatus}</p>

                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {ele?.menteeDetails?.skills?.map((skill, index) => (
                                                <span key={index} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-md">
                                                    {skill.skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-5 flex justify-center space-x-4">
                                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition" onClick={() => { setScheduleForm(true); setMeetingId(ele._id) }}>
                                            Schedule
                                        </button>
                                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition" onClick={() => handleChat(ele?.mentorId?._id, ele?.menteeId?._id)}>
                                            Chat
                                        </button>
                                        <button className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600 transition" onClick={() => handleJoin(ele?.mentorId?._id, ele?.menteeId?._id)}>
                                            Meet
                                        </button>
                                    </div>
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