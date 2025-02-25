import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

export default function HeroSection() {

    const { data } = useSelector((state) => state.users)
    const [search, setSearch] = useState('')
    const navigate = useNavigate()

    const handleSearch = (e) => {
        e.preventDefault()
        navigate(`/allMentor/?skill=${encodeURIComponent(search)}`);
    }
    return (
        <div>
            <div className="flex flex-col md:flex-row items-center justify-between px-10 py-20 max-w-7xl">
                <div className="md:w-1/2">
                    <h1 className="text-5xl font-bold text-gray-800 leading-tight mb-6">
                        Unlock Your Potential with <span className="text-blue-700">Expert Mentorship</span>
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
                        Connect with industry leaders to accelerate your learning, career growth, and personal development.
                    </p>
                    <div className="relative w-full max-w-lg">
                        <form onSubmit={handleSearch}>
                            <input className=" border border-gray-500 rounded-md w-full h-14 p-2 text-xl"
                                type="search"
                                placeholder="Search by skill"
                                value={search}
                                onChange={(e) => { setSearch(e.target.value) }}
                            />
                        </form>
                    </div>
                </div>
                <div className="flex justify-center">
                    <img src="/src/assets/h.jpg" alt="Mentorship" className="w-full max-w-md" />
                </div>
            </div>

            <div className=" mt-16 flex bg-gray-100 p-8 py-8 space-x-10 justify-between items-center">
                <img className="w-36" src="\src\assets\amazon-color.svg" />
                <img className="w-36" src="\src\assets\meta-color.svg" />
                <img className="w-36" src="\src\assets\spotify-color.svg" />
                <img className="w-24" src="\src\assets\uber.svg" />
                <img className="w-36" src="\src\assets\airbnb-color.svg" />
            </div>

            <div className="bg-blue-950 text-white text-center py-16 my-10 px-6">
                <h3 className="text-3xl font-semibold">Start Your Mentorship Journey Today!</h3>
                <p className="mt-4 text-lg">Find the right mentor and level up your career with expert guidance.</p>
                <button className="mt-6 px-6 py-3 bg-white text-blue-600 font-semibold text-lg rounded-md hover:bg-gray-200"
                    onClick={() => { navigate('/allMentor') }}>
                    Get Started
                </button>
            </div>

            <div className=" mt-20 flex bg-gray-100 p-8 py-14 space-x-10 justify-between items-left">
                {/* <img className="w-6/12 pt-10" src="\src\assets\help.jpg" /> */}
                <div className="px-15">
                    <h1 className="text-5xl  font-semibold pb-10">At your fingertips: a dedicated career coach</h1>
                    <p className="text-xl pb-8">Want to start a new dream career? Successfully build your startup? Itching to learn high-demand skills? Work smart with an online mentor by your side to offer expert advice and guidance to match your zeal. Become unstoppable using MentorCruise.</p>
                    <ol className="list-disc">
                        <li>Thousands of mentors available</li>
                        <li>Flexible program structures</li>
                        <li>Personal chats</li>
                    </ol>
                </div>
            </div>
        </div>
    )
}