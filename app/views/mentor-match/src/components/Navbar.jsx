import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import userImg from "../assets/menu.png"
export default function Navbar() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { data } = useSelector((state) => state.users)
    const [isDropdown, setIsDropdown] = useState(false)
    const [token, setToken] = useState(null)
    const [value, setValue] = useState('')

    const handleToogle = () => {
        setIsDropdown(!isDropdown)
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        setToken(null)
        setIsDropdown(false)
        navigate('/')

    }

    useEffect(() => {
        setToken(localStorage.getItem('token'))
    }, [data])


    const handleSelect = (e) => {
        setValue(e.target.getAttribute("value"))
        navigate(`/allMentors/${value}`)
    }

    return (
        <div>
            <div className="flex justify-between items-center bg-blue-950">

                <div className="p-3 pl-6 inline-flex">
                    <p className=" pl-1 text-3xl font-thin text-white"><span className="font-semibold text-white">Mentor</span> Match</p>
                </div>

                <div className="flex">
                    <ul className="flex space-x-8 p-4 justify-center">
                        {data.role == 'mentee' && (
                            <li className=" text-lg font-semibold text-white hover:bg-blue-800 hover:rounded-md hover:px-2 hover: py-1"><Link to="/allMentor">All Mentors</Link></li>
                        )}


                        <li className=" text-lg font-semibold text-white hover:bg-blue-800 hover:rounded-md hover:px-2 hover: py-1"><Link to="/register">Register</Link></li>
                        <li className=" text-lg font-semibold text-white hover:bg-blue-800 hover:rounded-md hover:px-2 hover: py-1"><Link to="/login">Login</Link></li>
                    </ul>
                    {token && (
                        <img className="w-8 h-8 mr-6 ml-2 justify-center mt-5" src={userImg} onClick={handleToogle} />
                    )}

                    {isDropdown && (
                        <div className="absolute right-0 mt-17 w-50 bg-white border rounded-lg">
                            <ul className="text-gray-700">
                                {data.role == 'mentor' ? (
                                    <div>
                                        <Link to="/profile"><li className="px-4 py-2 hover:bg-gray-200 cursor-pointer hover:rounded-sm" onClick={handleToogle}>Profile</li></Link>
                                        <Link to="/my-student"><li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={handleToogle}>My-Student</li></Link>
                                        <Link><li className="px-4 py-2 hover:bg-red-600 hover:text-white hover:rounded-sm text-red-600 cursor-pointer" onClick={handleLogout}>Logout</li></Link>
                                    </div>
                                ) : data.role == 'mentee' ? (
                                    <div>
                                        <Link to="/profile"><li className="px-4 py-2 hover:bg-gray-200 cursor-pointer hover:rounded-sm" onClick={handleToogle}>Profile</li></Link>
                                        <Link to="/my-bookings"><li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={handleToogle}>My-bookings</li></Link>
                                        <Link><li className="px-4 py-2 hover:bg-red-600 hover:text-white hover:rounded-sm text-red-600 cursor-pointer" onClick={handleLogout}>Logout</li></Link>


                                    </div>
                                ) : data.role == 'admin' && (
                                    <div>
                                        <Link to="/admin-dashboard"><li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={handleToogle}>Admin-Dashboard</li></Link>
                                        <Link><li className="px-4 py-2 hover:bg-red-600 hover:text-white hover:rounded-sm text-red-600 cursor-pointer" onClick={handleLogout}>Logout</li></Link>
                                    </div>
                                )}




                            </ul>
                        </div>
                    )}

                </div>
            </div>
            <hr />
            {
                data.role == 'mentee' && (
                    <div>
                        <ul className="p-4 px-2  py-2 flex justify-evenly items-center cursor-pointer">
                            <li className="hover:bg-gray-200 hover:px-2 py-1 rounded-lg" onClick={handleSelect} value="fullstack">Full-stack mentor</li>
                            <li className="hover:bg-gray-200 hover:px-2 py-1 rounded-lg" onClick={handleSelect} value="design">Design Mentors</li>
                            <li className="hover:bg-gray-200 hover:px-2 py-1 rounded-lg" onClick={handleSelect} value="startup">Startup Mentors</li>
                            <li className="hover:bg-gray-200 hover:px-2 py-1 rounded-lg" onClick={handleSelect} value="marketing">Marketing Coaches</li>
                            <li className="hover:bg-gray-200 hover:px-2 py-1 rounded-lg" onClick={handleSelect} value="datascience">Data Science Mentor</li>
                            <li className="hover:bg-gray-200 hover:px-2 py-1 rounded-lg" onClick={handleSelect} value="engineering">Engineering Mentors</li>
                        </ul>
                    </div>
                )
            }
            <div>

                <hr />
            </div>
        </div>
    )
}