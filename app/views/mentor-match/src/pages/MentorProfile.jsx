import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { mentorProfile } from "../redux/slices/mentorSlice"
import { format } from "date-fns"
import { getReviews } from "../redux/slices/reviewSlice"


export default function MentorProfile() {

    const [plan, setPlan] = useState('basic')
    const { singleData } = useSelector((state) => state.mentors)
    const { id } = useParams()
    const { data: reviews } = useSelector((state) => state?.reviews)
    console.log(reviews)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getReviews({ id }))
    }, [dispatch, id])

    useEffect(() => {
        if (!singleData || singleData._id !== id) {
            dispatch(mentorProfile({ id }))
        }
    }, [dispatch, id])

    if (!singleData) {
        return <h1>loading....</h1>
    }

    const handleApply = async (plan, amount) => {
        await navigate(`/apply-form/${singleData.userId._id}/${plan}/${amount}`)
    }

    const formatDate = (date) => {
        const formattedDate = format(date, 'yyyy-MM-dd')
        return formattedDate
    }


    return (
        <div className="min-h-screen flex flex-col">
            <div className="bg-cyan-900 w-full h-60 relative">
                {/* <img className="w-10 h-10 absolute left-80 top-75" src="/src/assets/linkedin.png" onClick={singleData.linkedIn}/> */}
                <div className="absolute top-25 left-10">
                    {singleData?.profilePic ? (
                        <img className="border-4 border-white w-50 h-50 rounded-full" src={singleData?.profilePic} />

                    ) : <img className="border-4 border-white w-50 h-50 rounded-full" src='assets/p.webp' />
                    }
                </div>
                <div className="grid grid-cols-2">
                    <div>
                        <p className="text-3xl font-semibold ps-10 pt-80">{singleData?.userId?.username}</p>
                        <p className="text-lg ps-10 mt-2">{singleData?.companyName}</p>
                        <p className="text-lg ps-10 mt-2">{singleData?.jobTitle}</p>
                        <p className="text-lg text-green-600 font-medium ps-10 mt-2 mb-4">{singleData?.bio}</p>
                        <p className="text-lg ps-10 mb-8">📍 {singleData?.location}</p>

                        <div className="flex flex-wrap gap-2 mt-2">
                            {singleData?.skills?.map((skill, index) => (
                                <span key={index} className=" bg-gray-200 mb-6 ml-10 text-gray-700 px-3 py-1 rounded-full text-lg">
                                    {skill.skill}
                                </span>
                            ))}
                        </div>

                        {/* <div className="flex flex-wrap gap-2 mt-2">
                            {singleData?.spokenLanguages?.map((skill, index) => (
                                <span key={index} className=" bg-gray-200 mb-6 ml-10 text-gray-800 px-3 py-1 rounded-full text-md">
                                    {skill}
                                </span>
                            ))}
                        </div> */}

                    </div>

                    <div className="border-2 border-gray-300 mb-40 p-10 pt-10 mt-15 rounded-2xl mr-20 ml-20 bg-white shadow-lg">
                        <div className="flex justify-around text-xl font-bold mb-4">
                            <p className={`cursor-pointer ${plan === 'basic' ? 'text-blue-600 text-2xl' : 'hover:text-blue-600 hover:text-2xl'}`} onClick={() => setPlan('basic')}>
                                Basic
                            </p>
                            <p className={`cursor-pointer ${plan === 'pro' ? 'text-blue-600 text-2xl' : 'hover:text-blue-600 hover:text-2xl'}`} onClick={() => setPlan('pro')}>
                                Pro
                            </p>
                        </div>

                        <hr className="border-gray-400 mb-4" />


                        {plan === 'basic' ? (
                            <div className="p-4 text-left">
                                <p className="font-bold text-5xl text-blue-600 mb-3">
                                    ₹ {singleData?.pricing?.basic?.amount} <span className="text-2xl font-bold text-gray-700">/ month</span>
                                </p>
                                <ul className="text-md font-semibold text-gray-800 space-y-1">
                                    <li>{singleData?.pricing?.basic?.features}</li>
                                    <li>📞 Calls: {singleData?.pricing?.basic?.call}</li>
                                    <li>🎥 Video Calls: {singleData?.pricing?.basic?.videoCall}</li>
                                    <li>⏳ Session Duration: {singleData?.pricing?.basic?.sessionDuration}</li>
                                    <li>💬 Unlimited Q&A via chat</li>
                                </ul>
                                <button className="mt-8 bg-blue-600 w-full text-white text-lg px-6 py-2 rounded-lg hover:bg-blue-700" onClick={() => { handleApply(plan, singleData?.pricing?.basic?.amount) }}>
                                    Apply Now
                                </button>
                            </div>
                        ) : (
                            <div className="p-4 text-left">
                                <p className="font-bold text-5xl text-blue-600 mb-3">
                                    ₹ {singleData?.pricing?.pro?.amount} <span className="text-2xl font-bold text-gray-700">/ month</span>
                                </p>
                                <ul className="text-md font-semibold text-gray-800 space-y-1">
                                    <li>{singleData?.pricing?.pro?.features}</li>
                                    <li>📞 Calls: {singleData?.pricing?.pro?.call}</li>
                                    <li>🎥 Video Calls: {singleData?.pricing?.pro?.videoCall}</li>
                                    <li>⏳ Session Duration: {singleData?.pricing?.pro?.sessionDuration}</li>
                                    <li>💬 Unlimited Q&A via chat</li>
                                </ul>
                                <button className="mt-8 bg-blue-600 w-full text-white text-lg px-6 py-2 rounded-lg hover:bg-blue-700" onClick={() => { handleApply(plan, singleData?.pricing?.pro?.amount) }}>
                                    Apply Now
                                </button>
                            </div>
                        )}
                    </div>

                </div>

                <hr />
                <p className="text-3xl font-semibold ps-10 my-8 " >About</p>
                <p className="text-lg ps-10 mb-10">{singleData?.about}</p>

                <hr />

                <div>
                    <div className="px-10 py-6">
                        <h2 className="text-3xl font-semibold mb-6">Experiences</h2>
                        {singleData?.experiences?.length > 0 ? (
                            singleData.experiences.map((exp, i) => (
                                <div key={i} className="p-6 mb-4 border border-gray-200 rounded-lg shadow-sm bg-white">
                                    <div className="flex flex-col md:flex-row md:justify-between">
                                        <div>
                                            <p className="text-xl font-bold text-gray-800">{exp?.companyName}</p>
                                            <p className="text-md text-gray-600 mt-1">{exp?.position}</p>
                                        </div>
                                        <div className="mt-4 md:mt-0 text-right">
                                            <p className="text-sm text-gray-500">
                                                {exp?.startingDate ? new Date(exp.startingDate).toLocaleDateString() : "N/A"}{" "}
                                                -{" "}
                                                {exp?.endingDate ? new Date(exp.endingDate).toLocaleDateString() : "Present"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-lg text-gray-500">No experiences available.</p>
                        )}
                    </div>
                </div>

                <hr />

                <div className="px-10 py-6">
                    <h2 className="text-3xl font-semibold mb-6">What mentees say</h2>
                    {reviews && reviews.length > 0 ? reviews.map((ele, i) => (
                        <div key={i} className="p-6 mb-4 border border-gray-200 rounded-lg shadow-sm bg-white">
                            <div className="flex flex-col md:flex-row md:justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-gray-800">{ele.reviewerId.username}</p>
                                    <p className="text-lg text-gray-700 mt-1">{ele.reviewText}</p>

                                    <div className="flex items-center mt-2">
                                        {Array.from({ length: 5 }, (_, index) => (
                                            <svg
                                                key={index}
                                                className={`w-6 h-6 ${ele.rating > index ? "text-green-500" : "text-gray-300"}`}
                                                fill="currentColor"
                                                viewBox="0 0 30 30"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.522 4.695a1 1 0 00.95.69h4.942c.969 0 1.371 1.24.588 1.81l-4 2.9a1 1 0 00-.364 1.118l1.522 4.695c.3.921-.755 1.688-1.54 1.118l-4-2.9a1 1 0 00-1.176 0l-4 2.9c-.784.57-1.838-.197-1.539-1.118l1.522-4.695a1 1 0 00-.364-1.118l-4-2.9c-.783-.57-.38-1.81.588-1.81h4.942a1 1 0 00.95-.69l1.522-4.695z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : <p className="text-lg text-gray-500">No reviews available.</p>}
                </div>


            </div>

        </div>
    )
}