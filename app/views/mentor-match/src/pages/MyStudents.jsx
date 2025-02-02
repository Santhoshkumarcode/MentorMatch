import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllMyStudent, statusUpdate } from "../redux/slices/meetingScheduleSlice"

export default function MyStudents() {

    const dispatch = useDispatch()
    const mentorId = useSelector((state) => state.users?.data?._id)
    const { data = [] } = useSelector((state) => state.meetingSchedules || {});

    useEffect(() => {
        if (mentorId) {
            dispatch(getAllMyStudent({ mentorId }))
        }
    }, [mentorId, dispatch])

    const handleAccept = (meetingId) => {
        console.log(meetingId)
        dispatch(statusUpdate({meetingId}))
    }

    const handleReject = (id) => {
        console.log(id)
    }

    return (
        <div>
            <div className="flex justify-evenly">
                <p className="text-2xl text-center my-4">Student Book</p>
                <p className="text-2xl text-center my-4">My Schedules</p>
            </div>
            <div>
                {data && (
                    data.map(ele => {
                        return (
                            <div className="border border-gray-300 rounded-lg shadow-md p-6 w-full max-w-md bg-white" key={ele._id}>
                                <p className="text-lg font-semibold text-gray-800">{ele.menteeId.username}</p>
                                <p className="text-base text-gray-600">Plan: {ele.plan}</p>
                                <p className="text-base text-gray-600 mb-4">Mentorship Goal: {ele.mentorshipGoal}</p>

                                <div className="flex gap-4">
                                    <button className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600" onClick={()=> {handleAccept(ele._id)}}>
                                        Accept
                                    </button>
                                    <button className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600" onClick={()=> {handleReject(ele._id)}}> 
                                        Reject
                                    </button>
                                </div>
                            </div>

                        )
                    })
                )}
            </div>
        </div>
    )
}