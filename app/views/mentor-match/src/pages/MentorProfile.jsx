import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { mentorProfile } from "../redux/slices/mentorSlice"

export default function MentorProfile() {

    const [plan, setPlan] = useState('basic')
    const { singleData } = useSelector((state) => state.mentors)
    const { id } = useParams()

    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        console.log('profile pic', singleData?.profilePic)
        if (!singleData || singleData._id !== id) {
            dispatch(mentorProfile({ id }))
        }
    }, [dispatch, singleData, id])

    if (!singleData) {
        return <h1>loading....</h1>
    }

    const handleApply = async (plan) => {
        await navigate(`/apply-form/${singleData.userId._id}/${plan}`)
    }

    return (
        <div className="min-h-screen flex flex-col">
            <div className="bg-cyan-900 w-full h-60">
                {/* <img className="w-10 h-10 absolute left-80 top-75" src="/src/assets/linkedin.png" onClick={singleData.linkedIn}/> */}
                <div className="absolute top-55 left-10">
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
                        <p className="text-lg ps-10 mb-8">{singleData?.location}</p>

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
                                <p className="font-extrabold text-4xl text-blue-600 mb-3">
                                    ₹ {singleData?.pricing?.basic?.amount} <span className="text-xl font-bold text-gray-700">/ month</span>
                                </p>
                                <ul className="text-md font-semibold text-gray-800 space-y-1">
                                    <li>{singleData?.pricing?.basic?.features}</li>
                                    <li>📞 Calls: {singleData?.pricing?.basic?.call}</li>
                                    <li>🎥 Video Calls: {singleData?.pricing?.basic?.videoCall}</li>
                                    <li>⏳ Session Duration: {singleData?.pricing?.basic?.sessionDuration}</li>
                                    <li>💬 Unlimited Q&A via chat</li>
                                </ul>
                                <button className="mt-8 bg-blue-600 w-full text-white text-lg px-6 py-2 rounded-lg hover:bg-blue-700" onClick={() => { handleApply(plan) }}>
                                    Apply Now
                                </button>
                            </div>
                        ) : (
                            <div className="p-4 text-left">
                                <p className="font-extrabold text-4xl text-blue-600 mb-3">
                                    ₹ {singleData?.pricing?.pro?.amount} <span className="text-xl font-bold text-gray-700">/ month</span>
                                </p>
                                <ul className="text-md font-semibold text-gray-800 space-y-1">
                                    <li>{singleData?.pricing?.pro?.features}</li>
                                    <li>📞 Calls: {singleData?.pricing?.pro?.call}</li>
                                    <li>🎥 Video Calls: {singleData?.pricing?.pro?.videoCall}</li>
                                    <li>⏳ Session Duration: {singleData?.pricing?.pro?.sessionDuration}</li>
                                    <li>💬 Unlimited Q&A via chat</li>
                                </ul>
                                <button className="mt-8 bg-blue-600 w-full text-white text-lg px-6 py-2 rounded-lg hover:bg-blue-700" onClick={() => { handleApply(plan) }}>
                                    Apply Now
                                </button>
                            </div>
                        )}
                    </div>

                </div>

                <hr />
                <hr />
                <p className="text-3xl font-semibold ps-10 my-8 " >About</p>
                <p className="text-lg ps-10">{singleData?.about}</p>

                <div>
                    <p className="text-3xl font-semibold ps-10 my-8 " >What mentees say</p>
                </div>
            </div>
        </div>
    )
}