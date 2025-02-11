import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { verifiedMentors } from "../redux/slices/mentorSlice"
import { useNavigate } from "react-router-dom"

export default function AllMentor() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { verifiedData } = useSelector((state) => state.mentors)

    useEffect(() => {
        dispatch(verifiedMentors())
    }, [verifiedData])

    const handleClick = async (id) => {
        navigate(`/mentor-profile/${id}`)
    }

    return (
        <div>
            {/* <p className="text-center my-6 text-3xl font-semibold">All Mentors</p> */}
            <div className="flex">
                <div className="w-1/4 p-6 space-y-6">
                    <h1 className="text-xl">Search</h1>
                    <input className="w-full border py-2 px-4 rounded border-gray-400" type="search" placeholder="Search for any skill" />

                    <select className="w-full border py-2 px-3 rounded border-gray-400">
                        <option>Filter</option>
                        <option>Top Mentors</option>
                        <option>Low - High</option>
                        <option>High - Low</option>
                    </select>
                </div>

                <div className="w-3/4 space-y-6 p-6">
                    {verifiedData &&

                        verifiedData.filter(ele => ele.pricing).map(ele => (
                            <div key={ele._id} className="flex border border-gray-200 rounded-lg bg-white p-6 space-x-6 shadow-lg">
                                {ele?.profilePic ? (
                                    <img className="w-32 h-32 border-2 border-gray-300 rounded-full" src={ele.profilePic} />

                                ) : <img className="w-32 h-32  border-2 border-gray-300 rounded-full" src='src/assets/p.webp' />
                                }

                                <div className="flex-2">
                                    <p className="text-2xl font-bold text-gray-800">{ele.userId.username}</p>
                                    <p className="text-gray-600 mt-1">{ele.companyName}</p>
                                    <p className="text-gray-600 mt-1 font-semibold">{ele.jobTitle}</p>
                                    <p className="text-gray-700 mt-3">{ele.bio}</p>
                                    <p className="text-gray-500 mt-2">{ele.about}</p>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 my-4">
                                        {ele.skills.map((e, index) => (
                                            <p key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm text-center">
                                                {e.skill}
                                            </p>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <p className="text-lg">Starts from: <span className="text-xl font-semibold text-gray-800">₹ {ele?.pricing?.basic?.amount}/month</span></p>
                                        <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600" onClick={() => { handleClick(ele.userId._id) }}>
                                            View Profile
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    )
}