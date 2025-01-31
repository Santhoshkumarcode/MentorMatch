import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { verifiedMentors } from "../redux/slices/mentorSlice"

export default function AllMentor() {

    const dispatch = useDispatch()

    const { verifiedData } = useSelector((state) => state.mentors)

    useEffect(() => {
        dispatch(verifiedMentors())
    }, [])
    return (
        <div>
            <h1 className="text-center text-3xl p-6">All Mentors</h1>
            <div className="flex justify-around">
                <ul>
                    <li>hello</li>
                    <li>hello</li>
                    <li>hello</li>
                    <li>hello</li>
                    <li>hello</li>
                </ul>

                <div>
                    {verifiedData &&
                        verifiedData.map(ele => {
                            return (
                                <div key={ele._id} className="border-1 border-gray-200 rounded-xl bg-gray-100 px-30 py-10 text-left ml-80 mr-10 mb-10">
                                    <p className="text-3xl font-semibold text-gray-700">{ele.userId.username}</p>
                                    {/* <img className="w-40 h-50 absolute left-72" src={ele.profilePic} /> */}
                                    <p className="text-gray-700 mt-2">{ele.companyName}</p>
                                    <p className="text-gray-800 mt-4">{ele.bio}</p>
                                    <p className="text-gray-600 mt-2">{ele.about}</p>
                                    <button className="mt-8 bg-blue-500 text-white px-8 py-2 rounded-lg  hover:bg-blue-700">view Profile</button>
                                </div>
                            )
                        })}
                </div>
            </div>
        </div>
    )
}