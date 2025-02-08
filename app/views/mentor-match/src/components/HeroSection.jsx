export default function HeroSection() {
    return (
        <div>
            <div className="flex">
                <div className="mt-28 ps-10">
                    <p className="text-lg pb-5">Learn a new skill, launch a project, land your dream career.</p>
                    <h1 className=" font-sans font-semibold text-5xl text-gray-800 pb-10">1-on-1 mentorship<br /> with industry experts!</h1>
                    <input className=" border border-gray-500 rounded-md w-full h-14 p-2 text-xl" type="search" placeholder="Search by skill" />
                    {/* <img src="\src\assets\help3.svg" className="w-5/12 ml-20" /> */}

                </div>
            </div>
            <div className=" mt-20 flex bg-gray-100 p-8 py-14 space-x-10 justify-between items-left">
               {/* <img className="w-6/12 pt-10" src="\src\assets\coach.png"/> */}
                <div>
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