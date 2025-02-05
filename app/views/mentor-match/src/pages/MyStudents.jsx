import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAcceptedStudent, getAllMyStudent, getMeetings, rejectStatus, statusUpdate, updateMeeting } from "../redux/slices/meetingScheduleSlice"
import DatePicker from "react-multi-date-picker";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'


const renderEventContent = (eventInfo) => {
    return (
        <div>
            <b>{eventInfo.event.title}</b> {/* Display meeting title */}
            <p>{new Date(eventInfo.event.start).toLocaleString()}</p> {/* Format and display start date */}
        </div>
    );
};



export default function MyStudents() {

    const dispatch = useDispatch()
    const mentorId = useSelector((state) => state.users?.data?._id)
    const { data, acceptedData, meetingDates } = useSelector((state) => state.meetingSchedules);
    const [currentPage, setCurrentPage] = useState('application')
    const [scheduleForm, setScheduleForm] = useState(false)
    const [dates, setDates] = useState([])
    const [meetingId, setMeetingId] = useState(null)


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

    const handleAccept = (meetingId) => {
        const confirm = window.confirm('Are you sure want to accept?')
        if (confirm) {
            dispatch(statusUpdate({ meetingId }))
        }
    }

    useEffect(() => {
        if (mentorId) {
            dispatch(getMeetings({ mentorId }))
        }
    }, [mentorId, dispatch])

    const handleReject = (meetingId) => {
        const confirm = window.confirm('Are you sure want to reject this student?')
        if (confirm) {
            dispatch(rejectStatus({ meetingId }))
        }
    }


    const handleScheduleSubmit = () => {
        console.log(dates)
        if (!meetingId || dates.length === 0) {
            alert("Please select dates before submitting.");
            return;
        }
        const formattedDates = dates.map(date => new Date(date).toISOString());
        const form = { dates: formattedDates };

        dispatch(updateMeeting({ meetingId, form }))
        setScheduleForm(false)
        setDates([])
    }
    const events = meetingDates.map(ele => ({
        title: ele.title.username,
        date: ele.start,
    }))

    console.log(events)

    return (
        <div>
            <div className="flex justify-evenly mt-4 mb-10">
                <p className="text-2xl text-center my-4" onClick={() => { setCurrentPage('application') }}>Applications</p>
                <p className="text-2xl text-center my-4" onClick={() => { setCurrentPage('students') }}>Students</p>
                <p className="text-2xl text-center my-4" onClick={() => { setCurrentPage('mySchedules') }}>My Schedules</p>
            </div>


            {/* <div className="flex justify-evenly my-4">
                {["application", "students", "mySchedules"].map((page) => (
                    <p
                        key={page}
                        className={`text-2xl text-center my-4 px-4 py-2 cursor-pointer rounded-md
                ${currentPage === page ? "bg-blue-500 text-white shadow-lg" : "text-gray-700 hover:bg-gray-200"}
            `}
                        onClick={() => setCurrentPage(page)}
                    >
                        {page === "application" ? "Applications" : page === "students" ? "Students" : "My Schedules"}
                    </p>
                ))}
            </div> */}


            <div>
                {currentPage === "application" ? (
                    <div className="flex space-x-10 justify-center">
                        {data &&
                            data.filter(ele => ele.status == 'pending').map((ele) => (
                                <div className="border border-gray-300 rounded-lg shadow-md p-6 w-full max-w-md bg-white" key={ele._id}>
                                    <p className="text-lg font-semibold text-gray-800">{ele.menteeId.username}</p>
                                    <p className="text-lg font-semibold text-gray-800">{ele.menteeId.email}</p>
                                    <p className="text-base text-gray-600">Plan: {ele.plan}</p>
                                    <p className="text-base text-gray-600 mb-4">Mentorship Goal: {ele.mentorshipGoal}</p>

                                    <div className="flex gap-4">
                                        <button className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600" onClick={() => handleAccept(ele._id)}>
                                            Accept
                                        </button>
                                        <button className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600" onClick={() => handleReject(ele._id)}>
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                ) : currentPage === "students" ? (

                    <div className="flex space-x-10  justify-center">
                        {acceptedData && acceptedData.map((ele, i) => (
                            <div key={i} className="border border-gray-300 rounded-lg shadow-md p-6 w-full max-w-md bg-white">
                                <p className="text-lg font-semibold text-gray-800">{ele.menteeId.username}</p>
                                <p className="text-lg font-semibold text-gray-800">{ele.menteeId.email}</p>
                                <p className="text-sm text-gray-600">{ele.plan}</p>
                                <p className="text-sm text-gray-600">{ele.mentorshipGoal}</p>
                                <p className="text-sm text-gray-600">Payment: {ele.paymentStatus}</p>
                                <div className="flex justify-end space-x-3 mt-4">
                                    <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={() => { setScheduleForm(true); setMeetingId(ele._id) }}>Schedule</button>
                                    <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Message</button>
                                    <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Meet</button>
                                </div>
                            </div>
                        ))}

                        {scheduleForm && (
                            <div className="fixed inset-0 flex justify-center items-center">
                                <div className="absolute inset-0 bg-black opacity-50"></div>

                                <div className="bg-white p-6 rounded-lg relative z-10">
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
                                        /><br />
                                        <button className=" p-2 mt-2 ms-13 rounded bg-blue-600 text-white hover:bg-blue-700" onClick={handleScheduleSubmit}>Schedule</button>
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
