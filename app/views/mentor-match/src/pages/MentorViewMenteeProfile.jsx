import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom";
import { menteeProfile } from "../redux/slices/menteeSlice";
import { getReviews } from "../redux/slices/reviewSlice";

export default function MentorViewMenteeProfile() {

    const { data } = useSelector((state) => state.mentees)
    const { data: reviews } = useSelector((state) => state.reviews)

    const { id } = useParams()
    console.log(id)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getReviews({ id }))
    }, [dispatch, id])

    useEffect(() => {
        dispatch(menteeProfile({ id }))
    }, [])
    if (!data) {
        return <p>loading</p>
    }

    return (
        <div>
            <div className="bg-cyan-900 w-full h-60">

                <div className="">
                    <div>
                        <div>
                            {data?.profilePic ? (
                                <img className="border-4 border-white absolute top-60 left-10 w-50 h-50 rounded-full" src={data?.profilePic} />
                            ) : (
                                <img className="border-4 border-white absolute top-60 left-10 w-50 h-50 rounded-full" src="\src\assets\user.png" />
                            )}

                            <p className="text-3xl font-semibold ps-10 pt-90">{data?.userId?.username}</p>
                            <p className="text-lg ps-10 mt-2">{data?.bio}</p>
                            <p className="text-lg ps-10 mt-2 font-semibold text-blue-600"><a src={data?.linkedIn}>LinkedIn</a></p>
                            <p className="text-lg ps-10 mt-2">{data?.phoneNumber}</p>
                            <p className="text-lg ps-10 mt-2">{data?.location}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {data?.skills?.map((skill, index) => (
                            <span key={index} className=" bg-gray-200 mb-6 ml-10 text-gray-700 px-3 py-1 rounded-full text-lg">
                                {skill.skill}
                            </span>
                        ))}
                    </div>

                    <hr />
                    <div>
                        <div className="px-10 py-6">
                            <h2 className="text-3xl font-semibold mb-6">Education</h2>
                            {data?.education?.length > 0 ? (
                                data.education.map((exp, i) => (
                                    <div key={i} className="p-6 mb-4 border border-gray-200 rounded-lg shadow-sm bg-white">
                                        <div className="flex flex-col md:flex-row md:justify-between">
                                            <div>
                                                <p className="text-xl font-bold text-gray-800">Institute - {exp?.institute}</p>
                                                <p className="text-lg font-semibold text-gray-600 mt-1">Degree - {exp?.degree}</p>
                                                <p className="text-lg font-semibold text-gray-600 mt-1">Field of Study - {exp?.fieldOfStudy}</p>
                                            </div>
                                            <div className="mt-4 md:mt-0 text-right">
                                                <p className="text-sm text-gray-500">
                                                    {exp?.startYear ? new Date(exp?.startYear).getFullYear() : "N/A"}{" "}
                                                    -{" "}
                                                    {exp?.endYear ? new Date(exp?.endYear).getFullYear() : "Present"}
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
                        <h2 className="text-3xl font-semibold mb-6">What mentor say</h2>
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
                                                    className={`w-6 h-6 ${ele.rating > index ? "text-yellow-400" : "text-gray-300"}`}
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
        </div>
    )
}