import { useSelector } from "react-redux"

export default function Profile() {
    const {data} = useSelector((state)=> state.users)
    return (
        <div>
            Profile
            <p>{data.email}</p>
            <p></p>
        </div>
    )
}