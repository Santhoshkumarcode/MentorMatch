import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
    const { data } = useSelector((state) => state.users)

    if (!localStorage.getItem('token') && !data) {
        return <Navigate to="/" replace />
    }
    return children
}