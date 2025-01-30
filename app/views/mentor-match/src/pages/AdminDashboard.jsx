import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchAllMentors } from "../redux/slices/mentorSlice"

export default function AdminDashboard() {

    const { data } = useSelector((state) => state.mentors)
    const dispatch = useDispatch()
    const [mentors, setMentors] = useState([])

    console.log(data)
    useEffect(() => {
        setMentors(dispatch(fetchAllMentors()))
    }, [])

    return (
        <div>
            <div className="text-center">
                <h1 className="text-3xl m-8">Mentors</h1>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 p-6">
                {data ? (
                    data.map((mentor) => (
                        <div
                            key={mentor._id}
                            className="bg-gray-50 p-4 shadow-md border border-gray-300 rounded-lg">
                            <h2 className="text-xl font-bold">{mentor.name}</h2>
                            <p className="text-gray-700">Company: {mentor.companyName}</p>
                            <p className="text-gray-700">Job Title: {mentor.jobTitle}</p>
                            {/* <button className="bg-green-500 px-10 py-2 rounded-xs hover:text-white mr-5">Accept</button>
                            <button className="bg-red-500 px-10 py-2 rounded-xs hover:text-white">Reject</button> */}
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