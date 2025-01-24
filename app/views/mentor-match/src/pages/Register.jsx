import { useState } from "react"
import { createUser } from "../redux/slices/userSlice"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

const initialState = {
    username: '',
    email: '',
    password: '',
    role: ''
}
export default function Register() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [form, setForm] = useState(initialState)

    const handleSubmit = (e) => {
        e.preventDefault()
        const resetForm = () => {
            setForm(initialState)
        }
        dispatch(createUser({ form, resetForm }))
        console.log(form)
        navigate('/')
    }

    return (
        <div className="justify-items-center mt-8">
            <h1>Register</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <input className="border"
                        type="text" placeholder="Enter UserName"
                        onChange={(e) => { setForm({ ...form, username: e.target.value }) }} />
                </div>

                <div>
                    <input className="border"
                        type="text" placeholder="Enter Email"
                        onChange={(e) => { setForm({ ...form, email: e.target.value }) }} />
                </div>

                <div>
                    <input className="border"
                        type="password" placeholder="Enter Password"
                        onChange={(e) => { setForm({ ...form, password: e.target.value }) }} />
                </div>

                <div>
                    <select className="border"
                        onChange={(e) => { setForm({ ...form, role: e.target.value }) }}>
                        <option value="">I am a</option>
                        <option value="mentor">Mentor</option>
                        <option value="mentee">Mentee</option>
                    </select>
                </div>

                <div>
                    <input className="bg-blue-400"
                        type="submit" value="Register" />
                </div>
            </form>
        </div>
    )
}