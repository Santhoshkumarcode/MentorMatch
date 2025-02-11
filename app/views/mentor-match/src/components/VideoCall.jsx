import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const JitsiMeet = ({ roomName, configOverwrite, userInfo, meetingId }) => {
    const jitsiContainer = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const navigate = useNavigate();

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
            configOverwrite: {
                ...configOverwrite,
                SHOW_PROMOTIONAL_CLOSE_PAGE: false,
            },
            interfaceConfigOverwrite: {
                SHOW_PROMOTIONAL_CLOSE_PAGE: false,
            },
        };

        const api = new window.JitsiMeetExternalAPI(domain, options);

        // Capture audio stream
        api.addEventListener("videoConferenceJoined", () => {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then((stream) => {
                    const mediaRecorder = new MediaRecorder(stream);
                    mediaRecorderRef.current = mediaRecorder;

                    mediaRecorder.ondataavailable = (event) => {
                        if (event.data.size > 0) {
                            setAudioChunks((prev) => [...prev, event.data]);
                        }
                    };

                    mediaRecorder.start();
                })
                .catch((error) => console.error("Error accessing microphone:", error));
        });

        // When call ends
        api.addEventListener("readyToClose", () => {
            if (mediaRecorderRef.current) {
                mediaRecorderRef.current.stop();
                mediaRecorderRef.current.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
                    sendAudioToBackend(audioBlob);
                };
            }
            api.dispose();
            navigate("/");
        });

        return () => api.dispose();
    }, [roomName, configOverwrite, userInfo, navigate, audioChunks]);

    // Send recorded audio to backend
    const sendAudioToBackend = async (audioBlob) => {
        const formData = new FormData();
        formData.append("audio", audioBlob, "meeting_audio.webm");
        formData.append("meetingId", meetingId);

        try {
            const response = await axios.put(`http://localhost:4000/api/meetings/transcript/${meetingId}`, formData)
            console.log(response.data)
        } catch (error) {
            console.error("Error uploading audio:", error);
        }
    };

    return <div ref={jitsiContainer} style={{ width: "100%", height: "500px" }} />;
};

export default JitsiMeet;
