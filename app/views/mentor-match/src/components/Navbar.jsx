import { Link } from "react-router-dom"

export default function Navbar() {
    return (
        <div>
            <div className="flex justify-between items-center">

                <div className="p-3 pl-6 inline-flex">
                    <p className=" pl-1 text-3xl font-thin"><span className="font-semibold">Mentor</span> Match</p>
                </div>

                <ul className="flex space-x-10 p-6 justify-center">
                    <li><Link to="/allMentor">All Mentors</Link></li>
                    <li><Link to="/register">Register</Link></li>
                    <li><Link to="/login">Login</Link></li>
                </ul>
            </div>
            <hr/>
        </div>
    )
}