import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAcceptedStudent, getAllMyStudent, rejectStatus, statusUpdate } from "../redux/slices/meetingScheduleSlice"

export default function MyStudents() {

    const dispatch = useDispatch()
    const mentorId = useSelector((state) => state.users?.data?._id)
    const { data, acceptedData } = useSelector((state) => state.meetingSchedules);
    const [currentPage, setCurrentPage] = useState('application')

    useEffect(() => {
        if (mentorId) {
            dispatch(getAllMyStudent({ mentorId }))
        }
    }, [mentorId, dispatch])


    useEffect(() => {
        if (mentorId) {
            dispatch(getAcceptedStudent({ mentorId }))
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
            dispatch(rejectStatus({meetingId}))
        }
    }

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
                        className={`text-2xl text-center my-4 px-4 py-2 cursor-pointer transition-all rounded-md
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
                                <p className="text-sm text-gray-600">{ele.menteeId.email}</p>
                                <div className="flex justify-end space-x-3 mt-4">
                                    <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Schedule</button>
                                    <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Message</button>
                                    <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Meet</button>
                                </div>
                            </div>
                        ))}
                    </div>


                ) : currentPage === "mySchedules" ? (
                    <div>
                        <p>My meeting Schedules</p>
                    </div>
                ) : null}
            </div>

        </div>
    )
}