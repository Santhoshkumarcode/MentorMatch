import { useDispatch, useSelector } from "react-redux"
import MentorProfilePage from "./MentorProfilePage"
import MenteeProfilePage from "./MenteeProfilePage"
import { useEffect } from "react"
import { mentorProfile } from "../redux/slices/mentorSlice"
import { menteeProfile } from "../redux/slices/menteeSlice"

export default function Profile() {

    const dispatch = useDispatch()
    const { data } = useSelector((state) => state.users)
    const { singleData } = useSelector((state) => state.mentors)
    const { data: menteeData } = useSelector((state) => state.mentees)
    const id = data?._id
    console.log(menteeData)

    useEffect(() => {
        if (data.role == 'mentor') {
            dispatch(mentorProfile({ id }))
        }

    }, [dispatch, id])

    useEffect(() => {
        if (data.role == 'mentee') {
            dispatch(menteeProfile({ id }))
        }
    })
    if (!data) {
        return <p>loading</p>
    }
    return (
        <div>
            {data?.role == 'mentor' ? (
                <MentorProfilePage data={singleData} />
            ) : (
                <MenteeProfilePage data={menteeData} />
            )}
        </div>
    )
}