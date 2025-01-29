import { Link } from "react-router-dom"

export default function Navbar() {
    return (
        <div>
            <div className="flex justify-between items-center">

                <div className="p-3 pl-6 inline-flex">
                    <p className=" pl-1 text-3xl font-thin"><span className="font-semibold">Mentor</span> Match</p>
                </div>

                {/* <div>
                    <input className="border w-96 h-8" ctype="search" placeholder="Search"/>
                </div> */}
                <div className="flex">
                    <ul className="flex space-x-10 p-6 justify-center">
                        <li className=" text-lg font-semibold hover:text-blue-700"><Link to="/allMentor">All Mentors</Link></li>
                        <li className=" text-lg font-semibold hover:text-blue-700"><Link to="/register">Register</Link></li>
                        <li className=" text-lg font-semibold hover:text-blue-700"><Link to="/login">Login</Link></li>
                    </ul>


                    <Link to='/profile'><img className="w-6 mr-6 justify-center mt-7" src="src\assets\user-avatar.png" /></Link>
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