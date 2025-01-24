import { useState } from "react"

export default function Login() {
    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(form)
    }
    return (
        <div className="justify-items-center mt-8">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <input className="border"
                        type="text" placeholder="Email"
                        onChange={(e) => { setForm({ ...form, email: e.target.value }) }} />
                </div>

                <div>
                    <input className="border"
                        type="password" placeholder="Password"
                        onChange={(e) => { setForm({ ...form, password: e.target.value }) }} />
                </div>

                <div>
                    <input className="bg-blue-400"
                        type="submit" value="Login" />
                </div>
            </form>
        </div>
    )
}