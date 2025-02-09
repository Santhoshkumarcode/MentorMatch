import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"

import MentorProfilePage from "./MentorProfilePage"
import MenteeProfilePage from "./MenteeProfilePage"
import { mentorProfile } from "../redux/slices/mentorSlice"
import { menteeProfile } from "../redux/slices/menteeSlice"
import { useParams } from "react-router-dom"

export default function Profile() {

    const { id, role } = useParams()
    const dispatch = useDispatch()
    const { data } = useSelector((state) => state.users)
    const { singleData } = useSelector((state) => state.mentors)
    const { data: menteeData } = useSelector((state) => state.mentees)

    

    useEffect(() => {
        console.log(role, id)
        if (role === 'mentor') {
            dispatch(mentorProfile({ id }))
        }
        if (role === 'mentee') {
            dispatch(menteeProfile({ id }));
        }

    }, [dispatch, id, role])

    if (!data) {
        return <p>loading</p>
    }
    return (
        <div>
            {role === 'mentor' ? (
                <MentorProfilePage data={singleData} />
            ) : (
                <MenteeProfilePage data={menteeData} />
            )}
        </div>
    )
}