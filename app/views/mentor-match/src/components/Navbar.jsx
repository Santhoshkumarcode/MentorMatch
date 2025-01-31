import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

export default function Navbar() {

    const { data } = useSelector((state) => state.users)
    const [isDropdown, setIsDropdown] = useState(false)
    const [token, setToken] = useState(null)

    const handleToogle = () => {
        setIsDropdown(!isDropdown)
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        setToken(null)
        setIsDropdown(false)
    }

    useEffect(() => {
        setToken(localStorage.getItem('token'))
    }, [data])

    return (
        <div>
            <div className="flex justify-between items-center bg-blue-950">

                <div className="p-3 pl-6 inline-flex">
                    <p className=" pl-1 text-3xl font-thin text-white"><span className="font-semibold text-white">Mentor</span> Match</p>
                </div>

                <div className="flex">
                    <ul className="flex space-x-8 p-4 justify-center">
                        <li className=" text-lg font-semibold text-white hover:bg-blue-800 hover:rounded-md hover:px-2 hover: py-1"><Link to="/allMentor">All Mentors</Link></li>
                        <li className=" text-lg font-semibold text-white hover:bg-blue-800 hover:rounded-md hover:px-2 hover: py-1"><Link to="/register">Register</Link></li>
                        <li className=" text-lg font-semibold text-white hover:bg-blue-800 hover:rounded-md hover:px-2 hover: py-1"><Link to="/login">Login</Link></li>
                    </ul>
                    {token && (
                        <img className="w-8 h-8 mr-6 ml-2 justify-center mt-4.5" src="src\assets\user.png" onClick={handleToogle} />
                    )}
                    {isDropdown && (
                        <div className="absolute right-0 mt-17 w-50 bg-white border rounded-lg">
                            <ul className="text-gray-700">
                                <Link to="/profile"><li className="px-4 py-2 hover:bg-gray-200 cursor-pointer hover:rounded-sm" onClick={handleToogle}>Profile</li></Link>
                                <Link to="/admin-dashboard"><li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={handleToogle}>Admin-Dashboard</li></Link>
                                <Link to="/my-student"><li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={handleToogle}>My-Student</li></Link>
                                <Link><li className="px-4 py-2 hover:bg-red-600 hover:text-white hover:rounded-sm text-red-600 cursor-pointer" onClick={handleLogout}>Logout</li></Link>
                            </ul>
                        </div>
                    )}

                </div>
            </div>
            <hr />
            <div>
                <ul className="p-4 px-2  py-2 flex justify-evenly items-center cursor-pointer">
                    <li className="hover:bg-gray-200 hover:px-2 py-1 rounded-lg">Full-stack mentor</li>
                    <li className="hover:bg-gray-200 hover:px-2 py-1 rounded-lg">Design Mentors</li>
                    <li className="hover:bg-gray-200 hover:px-2 py-1 rounded-lg">Startup Mentors</li>
                    <li className="hover:bg-gray-200 hover:px-2 py-1 rounded-lg">Marketing Coaches</li>
                    <li className="hover:bg-gray-200 hover:px-2 py-1 rounded-lg">Data Science Mentor</li>
                    <li className="hover:bg-gray-200 hover:px-2 py-1 rounded-lg">Engineering Mentors</li>
                </ul>
                <hr />
            </div>
        </div>
    )
}