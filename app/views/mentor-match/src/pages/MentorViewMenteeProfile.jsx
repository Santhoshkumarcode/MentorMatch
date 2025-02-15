import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom";
import { menteeProfile } from "../redux/slices/menteeSlice";

export default function MentorViewMenteeProfile() {

    const { data } = useSelector((state) => state.mentees)
    console.log(data)

    const { id } = useParams()
    console.log(id)

    const dispatch = useDispatch()

    useEffect(() => {
       dispatch(menteeProfile({id})) 
    },[])
    if (!data) {
        return <p>loading</p>
    }

    return (
        <div>
            <div className="bg-cyan-900 w-full h-60">

                <div className="">
                    <div>
                        <img className="border-4 border-white absolute top-40 left-10 w-50 h-50 rounded-full" src={data?.profilePic} />
                        <p className="text-3xl font-semibold ps-10 pt-80">{data?.userId?.username}</p>
                        <p className="text-lg ps-10 mt-2">{data?.bio}</p>
                        <p className="text-lg ps-10 mt-2 font-semibold text-blue-600"><a src={data?.linkedIn}>LinkedIn</a></p>
                        <p className="text-lg ps-10 mt-2">{data?.phoneNumber}</p>
                        <p className="text-lg ps-10 mt-2">{data?.location}</p>

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
                                                    {exp?.startYear ? exp?.startYear : "N/A"}{" "}
                                                    -{" "}
                                                    {exp?.endYear ? exp?.endYear : "Present"}
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
                </div>
            </div>
        </div>
    )
}