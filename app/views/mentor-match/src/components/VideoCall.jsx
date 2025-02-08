import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const JitsiMeet = ({ roomName, configOverwrite, userInfo }) => {
    const jitsiContainer = useRef(null);

    const navigate = useNavigate()
    useEffect(() => {
        if (!window.JitsiMeetExternalAPI) {
            console.error("Jitsi Meet API not loaded!");
            return;
        }

        const domain = "meet.jit.si";
        const options = {
            roomName: roomName,
            parentNode: jitsiContainer.current,
            userInfo: userInfo,
            configOverwrite: configOverwrite,
        };

        const api = new window.JitsiMeetExternalAPI(domain, options);

        api.addEventListener("readyToClose", () => {
            navigate("/");
        });

        return () => api.dispose(); 
    }, [roomName, configOverwrite, userInfo,navigate]);

    return <div ref={jitsiContainer} style={{ width: "100%", height: "500px" }} />;
};

export default JitsiMeet;
