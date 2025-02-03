export default function MenteeProfilePage({ data }) {

    console.log(data)
    return (
        <div>
            <div className="bg-cyan-900 w-full h-60">
                <img className= "w-10 h-10 absolute right-6 top-71 cursor-pointer" src="/src/assets/a.png"/>
                <div className="">
                    <div>
                        {/* <img className="absolute top-50 left-10 w-50 h-50 rounded-full" src={data.profilPic} /> */}
                        <p className="text-3xl font-semibold ps-10 pt-80">{data?.userId?.username}</p>
                        {/* <p className="text-lg ps-10 mt-2">{data?.companyName}</p>
                        <p className="text-lg text-green-600 font-medium ps-10 mt-2 mb-4">{data?.bio}</p>
                        <p className="text-lg ps-10 mb-8">{data?.location}</p>
                        <hr />
                        <p className="text-3xl font-semibold ps-10 my-8 " >About</p>
                        <p className="text-lg ps-10">{data?.about}</p> */}
                    </div>
                </div>
            </div>
        </div>
    )
}