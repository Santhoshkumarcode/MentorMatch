import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import userImg from "../assets/menu.png"
import { logout, userProfile } from "../redux/slices/userSlice"
export default function Navbar() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { data, isLoggedIn } = useSelector((state) => state.users)
    const [isDropdown, setIsDropdown] = useState(false)
    const [token, setToken] = useState(localStorage.getItem('token'))

    const handleToogle = () => {
        setIsDropdown(!isDropdown)
    }


    const handleLogout = () => {
        localStorage.removeItem('token')
        setToken(null)
        dispatch(logout())
        setIsDropdown(false)

        setTimeout(() => {
            navigate('/');
        }, 100);
    }

    useEffect(() => {
        if (token) {
            dispatch(userProfile());
        }
    }, [dispatch, token])


    const handleSelect = (e) => {
        const selectedValue = e.target.value;
        if (selectedValue) {
            navigate(`/allMentor/?skill=${selectedValue}`);
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center bg-blue-950">

                <div className="p-3 pl-6 inline-flex">
                    <Link to="/"><p className=" pl-1 text-3xl font-thin text-white"><span className="font-semibold text-white">Mentor</span> Match</p></Link>
                </div>

                <div className="flex">
                    <ul className="flex space-x-8 p-4 justify-center">


                        <li className=" text-lg font-semibold text-white hover:bg-blue-800 hover:rounded-md hover:px-2 hover: py-1"><Link to="/">Home</Link></li>

                        {data?.role == 'mentee' && isLoggedIn && (
                            <li className=" text-lg font-semibold text-white hover:bg-blue-800 hover:rounded-md hover:px-2 hover: py-1"><Link to="/allMentor">All Mentors</Link></li>
                        )}
                    </ul>

                    {isLoggedIn ? (
                        <img className="w-8 h-8 mr-6 ml-2 justify-center mt-5" src={userImg} onClick={handleToogle} />
                    ) : (
                        <div className="flex  items-center list-none space-x-4 mr-6">
                            <li className=" text-lg font-semibold text-white hover:bg-blue-800 hover:rounded-md hover:px-2 hover: py-1"><Link to="/register">Register</Link></li>
                            <li className=" text-lg font-semibold text-white hover:bg-blue-800 hover:rounded-md hover:px-2 hover: py-1"><Link to="/login">Login</Link></li>
                        </div>
                    )}

                    {isDropdown && (
                        <div className="absolute right-0 mt-17 w-50 bg-white border rounded-lg z-50">
                            <ul className="text-gray-700 text-lg">

                                {data?.role == 'mentor' ? (
                                    <div>
                                        <Link to={`/profile/${data?._id}/${data?.role}`}><li className="px-4 py-2 hover:bg-gray-200 cursor-pointer hover:rounded-sm" onClick={handleToogle}>Profile</li></Link>
                                        <Link to={`/my-student/${data?._id}`}><li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={handleToogle}>My-Student</li></Link>
                                        <Link><li className="px-4 py-2 hover:bg-red-600 hover:text-white hover:rounded-sm text-red-600 cursor-pointer" onClick={handleLogout}>Logout</li></Link>

                                    </div>
                                ) : data?.role == 'mentee' ? (
                                    <div>
                                        <Link to={`/profile/${data?._id}/${data?.role}`}><li className="px-4 py-2 hover:bg-gray-200 cursor-pointer hover:rounded-sm" onClick={handleToogle}>Profile</li></Link>
                                        <Link to={`/my-bookings/${data?._id}`}><li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={handleToogle}>My-bookings</li></Link>
                                        <Link><li className="px-4 py-2 hover:bg-red-600 hover:text-white hover:rounded-sm text-red-600 cursor-pointer" onClick={handleLogout}>Logout</li></Link>


                                    </div>
                                ) : data?.role == 'admin' && (
                                    <div>
                                        <Link to="/admin-dashboard"><li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={handleToogle}>Admin-Dashboard</li></Link>
                                        <Link to="/admin-analytics"><li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={handleToogle}>Admin-Dashboard</li></Link>
                                        <Link><li className="px-4 py-2 hover:bg-red-600 hover:text-white hover:rounded-sm text-red-600 cursor-pointer" onClick={handleLogout}>Logout</li></Link>
                                    </div>
                                )}
                            </ul>
                        </div>
                    )}

                </div>
            </div>
            <hr />

            <div className="shadow-md">
                <ul className="p-4 px-2  py-4 flex justify-evenly items-center cursor-pointer">
                    <button className="hover:bg-gray-200 hover:px-2 py-1 rounded-lg" onClick={handleSelect} value="fullstack">Full-stack mentor</button>
                    <button className="hover:bg-gray-200 hover:px-2 py-1 rounded-lg" onClick={handleSelect} value="design">Design Mentors</button>
                    <button className="hover:bg-gray-200 hover:px-2 py-1 rounded-lg" onClick={handleSelect} value="startup">Startup Mentors</button>
                    <button className="hover:bg-gray-200 hover:px-2 py-1 rounded-lg" onClick={handleSelect} value="marketing">Marketing Coaches</button>
                    <button className="hover:bg-gray-200 hover:px-2 py-1 rounded-lg" onClick={handleSelect} value="datascience">Data Science Mentor</button>
                </ul>
            </div>
            <div>
            </div>
        </div>
    )
}