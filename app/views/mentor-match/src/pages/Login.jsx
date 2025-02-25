import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, userProfile } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import isEmail from "validator/lib/isEmail";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const serverError = useSelector((state) => state?.users?.serverError)
    console.log(serverError)

    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [clientErrors, setClientErrors] = useState(null);
    const errors = {};

    const runClientValidation = () => {
        if (form.email.trim().length === 0) {
            errors.email = "Email should not be empty.";
        } else if (!isEmail(form.email)) {
            errors.email = "Email should be in proper format.";
        }

        if (form.password.trim().length === 0) {
            errors.password = "Password should not be empty.";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        runClientValidation();

        if (Object.keys(errors).length !== 0) {
            setClientErrors(errors);
        } else {
            try {
                const resetForm = () => {
                    setForm({
                        email: "",
                        password: "",
                    });
                };
                await dispatch(loginUser({ form, resetForm })).unwrap()
                toast.success("You have logged in successfully!");
                await dispatch(userProfile()).unwrap()
                navigate("/");
            } catch (err) {
                console.log(err);
                toast.error("Login failed. Please check your credentials.");
            }
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <img className="w-96 h-screen" src="src\assets\security.svg" />
            <div className="w-full max-w-sm bg-white rounded-lg p-8">
                <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                            type="email"
                            placeholder="Email"
                            onChange={(e) => {
                                setForm({ ...form, email: e.target.value });
                                setClientErrors((prev) => ({ ...prev, email: "" }));
                            }}
                        />
                        {clientErrors && <p className="text-sm text-red-500 mt-1">{clientErrors.email}</p>}
                        {serverError && (
                            Array.isArray(serverError) ? (
                                serverError
                                    .filter(ele => ele.path === 'email')
                                    .map((e, index) => <p key={index} className="text-sm text-red-500">{e.msg}</p>)
                            ) : (
                                typeof serverError === 'string' && <p className="text-sm text-red-500">{serverError}</p>
                            )
                        )}

                    </div>

                    <div>
                        <input
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                            type="password"
                            placeholder="Password"
                            onChange={(e) => {
                                setForm({ ...form, password: e.target.value });
                                setClientErrors((prev) => ({ ...prev, password: "" }));
                            }}
                        />
                        {clientErrors && <p className="text-sm text-red-500 mt-1">{clientErrors.password}</p>}
                        {serverError && (
                            Array.isArray(serverError) ? (
                                serverError
                                    .filter(ele => ele.path === 'password')
                                    .map((e, index) => <p key={index} className="text-sm text-red-500">{e.msg}</p>)
                            ) : (
                                typeof serverError === 'string' && <p className="text-sm text-red-500">{serverError}</p>
                            )
                        )}
                    </div>

                    <div>
                        <input
                            type="submit"
                            value="Login"
                            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600" />
                    </div>
                    <p className="text-sm text-gray-600">
                        Create new account?{" "}
                        <Link to="/register" className="text-blue-600 font-medium hover:underline">
                            REGISTER
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
