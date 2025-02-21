import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { userProfile } from "../redux/slices/userSlice";

export default function PrivateRoute(props) {
    const dispatch = useDispatch();
    const { data, loading } = useSelector((state) => state.users);
    const token = localStorage.getItem('token');
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        if (token && !data) {
            dispatch(userProfile())
        } else {
            setIsFetching(false);
        }
    }, [dispatch, token, data]);

    if (loading || isFetching) return <p>Loading...</p>;

    if (!token || !data) {
        return <Navigate to="/login" replace />;
    }

    if (props.permittedRoles && !props.permittedRoles.includes(data?.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return props.children;
}
