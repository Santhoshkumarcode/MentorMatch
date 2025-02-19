import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { verifiedMentors } from "../redux/slices/mentorSlice"
import { useNavigate, useSearchParams } from "react-router-dom"

export default function AllMentor() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [sortOrder, setSortOrder] = useState('')
    const [skill, setSkill] = useState('')
    const [searchParams, setSearchParams] = useSearchParams()
    const skillParam = searchParams.get("skill")
    const jobTitle = searchParams.get('search')
    const limit = 2

    useEffect(() => {
        if (skillParam) {
            setSkill(skillParam)
        } else if (jobTitle) {
            setSearch(jobTitle)
        }
    }, [skillParam, jobTitle])

    const { verifiedData } = useSelector((state) => state.mentors)

    useEffect(() => {
        dispatch(verifiedMentors({ search, page, limit, skill, sortOrder }))
    }, [search, page, skill, limit, sortOrder])


    const handleClick = async (id) => {
        navigate(`/mentor-profile/${id}`)
    }

    const handlePagination = (direction) => {
        if (direction === "next") {
            setPage(page + 1);
        } else if (direction === "prev") {
            setPage(page - 1);
        }
    };

    return (
        <div>
            {/* <p className="text-center my-6 text-3xl font-semibold">All Mentors</p> */}
            <div className="flex">
                <div className="w-1/4 p-6 space-y-6">
                    <h1 className="text-xl">Search</h1>

                    <input className="w-full border py-2 px-4 rounded border-gray-400"
                        type="search"
                        placeholder="Search by Job Title"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value) }}
                    />

                    <input className="w-full border py-2 px-4 rounded border-gray-400"
                        type="search"
                        placeholder="Search by skills"
                        value={skill}
                        onChange={(e) => { setSkill(e.target.value) }}
                    />

                    <select className="w-full border py-2 px-3 rounded border-gray-400"
                        onChange={(e) => { setSortOrder(e.target.value) }}>
                        <option>Filter</option>
                        <option value="asc">Low - High</option>
                        <option value="desc">High - Low</option>
                    </select>
                </div>

                <div className="w-3/4 space-y-6 p-6">
                    {verifiedData &&

                        verifiedData?.data?.filter(ele => ele.pricing).map(ele => (
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

            <div className="flex justify-center mt-6 mb-6">
                <nav aria-label="Pagination">
                    <ul className="flex items-center space-x-2">
                        <li>
                            <button
                                className={`px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400`}
                                onClick={() => handlePagination("prev")}
                            >
                                Prev
                            </button>
                        </li>

                        <li>
                            <p className="px-4 py-2 text-gray-700 font-semibold">
                                Page {verifiedData?.page} of {verifiedData?.totalPages}
                            </p>
                        </li>
                        <li>
                            <button
                                className={`px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400`}
                                onClick={() => handlePagination("next")}
                            >
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div >
    )
}