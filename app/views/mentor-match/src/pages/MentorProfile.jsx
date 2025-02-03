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
        <div>
            <div className="bg-cyan-900 w-full h-60">
                {/* <img className="w-10 h-10 absolute left-80 top-75" src="/src/assets/linkedin.png" onClick={singleData.linkedIn}/> */}
                <img className="border-4 border-white absolute top-50 left-10 w-50 h-50 rounded-full" src={ singleData.profilePic} />
                <div className="grid grid-cols-2">
                    <div>
                        <p className="text-3xl font-semibold ps-10 pt-80">{singleData?.userId?.username}</p>
                        <p className="text-lg ps-10 mt-2">{singleData?.companyName}</p>
                        <p className="text-lg text-green-600 font-medium ps-10 mt-2 mb-4">{singleData?.bio}</p>
                        <p className="text-lg ps-10 mb-8">{singleData?.location}</p>
                        <hr />
                        <p className="text-3xl font-semibold ps-10 my-8 " >About</p>
                        <p className="text-lg ps-10">{singleData?.about}</p>
                    </div>

                    <div className="border-2 border-gray-300 mb-80   p-10 pt-10 mt-15 rounded-2xl mr-20 ml-20 bg-white">
                        <div className="flex justify-around text-xl font-semibold mb-4">
                            <p className="hover:text-blue-600 hover:text-2xl cursor-pointer" onClick={() => setPlan('basic')}>Basic</p>
                            <p className="hover:text-blue-600 hover:text-2xl cursor-pointer" onClick={() => setPlan('pro')}>Pro</p>

                            {/* <p className="hover:bg-cyan-900 px-4 rounded-lg hover:text-white py-1 cursor-pointer" onClick={() => setPlan('basic')}>Basic</p>
                            <p className="hover:bg-cyan-900 px-4 rounded-lg hover:text-white py-1 cursor-pointer" onClick={() => setPlan('pro')}>Pro</p> */}

                        </div>
                        <hr />
                        {plan == 'basic' ? <div className=" p-4">
                            <p className="font-bold text-3xl">₹ {singleData?.pricing?.basic?.amount} <span className="text-xl">/ month</span></p>
                            <p>{singleData?.pricing?.basic?.features}</p>
                            <p>calls {singleData?.pricing?.basic?.call}</p>
                            <p>video call {singleData?.pricing?.basic?.videoCall}</p>
                            <p>session duration {singleData?.pricing?.basic?.sessionDuration}</p>
                            <p>Unlimited Q&A via chat</p>
                            <button className="mt-10 bg-blue-500 w-full text-white px-8 py-2 rounded-lg  hover:bg-blue-700" onClick={() => handleApply(plan)}>Apply Now</button>
                        </div> : <div className=" p-4">
                            <p className="font-bold text-3xl">₹ {singleData?.pricing?.pro?.amount} <span className="text-xl">/ month</span></p>
                            <p>{singleData?.pricing?.pro?.features}</p>
                            <p>calls {singleData?.pricing?.pro?.call}</p>
                            <p>video call {singleData?.pricing?.pro?.videoCall}</p>
                            <p>session duration {singleData?.pricing?.pro?.sessionDuration}</p>
                            <p>Unlimited Q&A via chat</p>
                            <button className="mt-10 bg-blue-500 w-full text-white px-8 py-2 rounded-lg  hover:bg-blue-700" onClick={() => handleApply(plan)}>Apply Now</button>
                        </div>}

                    </div>
                </div>



            </div>
        </div>
    )
}