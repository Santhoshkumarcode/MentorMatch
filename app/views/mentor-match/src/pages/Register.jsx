import { useState } from "react";
import { createUser, userProfile } from "../redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import isEmail from "validator/lib/isEmail";

const initialState = {
    username: "",
    email: "",
    password: "",
    role: "",
};

export default function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { serverError } = useSelector((state) => state.users);
    const [form, setForm] = useState(initialState);
    const [clientErrors, setClientErrors] = useState(null);
    const errors = {};

    const runClientValidation = () => {
        if (form.username.trim().length === 0) {
            errors.username = "Username should not be empty.";
        }
        if (form.email.trim().length === 0) {
            errors.email = "Email should not be empty.";
        } else if (!isEmail(form.email)) {
            errors.email = "Email should be in proper format.";
        }
        if (form.password.trim().length === 0) {
            errors.password = "Password should not be empty.";
        }
        if (form.role.trim().length === 0) {
            errors.role = "Select your role.";
        }
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        runClientValidation();

        if (Object.keys(errors).length !== 0) {
            setClientErrors(errors);
            return 
        } else {
            try {
                const resetForm = () => {
                    setForm(initialState);
                };
                await dispatch(createUser({ form, resetForm })).unwrap()
                await dispatch(userProfile()).unwrap()
                if (form.role == 'mentor') {
                    navigate('/mentor-detail')
                } else if(form.role == 'mentee') {
                    navigate('/mentee-detail');
                }
            } catch (err) {
                console.log(err);
            }
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <img className="w-96 h-screen" src=" src\assets\security.svg" />
            <div className="w-full max-w-md bg-white p-8 rounded-lg">
                <h1 className="text-2xl text-gray-800 mb-6 text-center">Register</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Enter Username"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                            onChange={(e) => {
                                setForm({ ...form, username: e.target.value });
                                setClientErrors((prev) => ({ ...prev, username: "" }))}}
                        />
                        {clientErrors && <p className="text-sm text-red-500 mt-1">{clientErrors.username}</p>}
                        {serverError && serverError
                            .filter(ele => ele.path == 'username')
                            .map(ele => <p className="text-sm text-red-500">{ele.msg}</p>)}
                    </div>

                    <div>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                            onChange={(e) => {
                                setForm({ ...form, email: e.target.value });
                                setClientErrors((prev) => ({ ...prev, email: "" }));
                            }}
                        />
                        {clientErrors && <p className="text-sm text-red-500 mt-1">{clientErrors.email}</p>}
                        {serverError &&
                            serverError
                                .filter(ele => ele.path === "email")
                                .map(ele => <p className="text-sm text-red-500">{ele.msg}</p>)}
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                            onChange={(e) => {
                                setForm({ ...form, password: e.target.value });
                                setClientErrors((prev) => ({ ...prev, password: "" }));
                            }}
                        />
                        {clientErrors && <p className="text-sm text-red-500 mt-1">{clientErrors.password}</p>}
                        {serverError && serverError
                            .filter(ele => ele.path == 'password')
                            .map(ele => <p className="text-sm text-red-500">{ele.msg}</p>)}
                    </div>

                    <div>
                        <select
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                            onChange={(e) => {
                                setForm({ ...form, role: e.target.value });
                                setClientErrors((prev) => ({ ...prev, role: "" }));
                            }}
                        >
                            <option value="">I am a</option>
                            <option value="mentor">Mentor</option>
                            <option value="mentee">Mentee</option>
                        </select>
                        {clientErrors && <p className="text-sm text-red-500 mt-1">{clientErrors.role}</p>}
                        {serverError && serverError
                            .filter(ele => ele.path == 'role')
                            .map(ele => <p className="text-sm text-red-500">{ele.msg}</p>)}
                    </div>

                    <div>
                        <input
                            type="submit"
                            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600" value="Register" />
                        
                    </div>
                </form>
            </div>
        </div>
    );
}
