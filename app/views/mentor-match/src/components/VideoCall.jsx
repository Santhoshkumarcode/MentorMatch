import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const JitsiMeet = ({ roomName, configOverwrite, userInfo, meetingId }) => {
    const jitsiContainer = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]); // Store audio chunks in a ref to prevent re-rendering
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
                SHOW_PROMOTIONAL_CLOSE_PAGE: false, // Disable Jitsi promotional page
                SHOW_POWERED_BY: false, // Hide "Powered by Jitsi"
            },
            interfaceConfigOverwrite: {
                SHOW_PROMOTIONAL_CLOSE_PAGE: false,
                SHOW_WATERMARK: false, // Hide Jitsi watermark
                SHOW_BRAND_WATERMARK: false,
                SHOW_JITSI_WATERMARK: false
            },
        };

        const api = new window.JitsiMeetExternalAPI(domain, options);

        // Capture audio stream when meeting starts
        api.addEventListener("videoConferenceJoined", () => {
            console.log("Meeting joined. Requesting microphone access...");

            navigator.mediaDevices.getUserMedia({ audio: true })
                .then((stream) => {
                    console.log("Microphone access granted. Starting recording...");

                    const mediaRecorder = new MediaRecorder(stream);
                    mediaRecorderRef.current = mediaRecorder;
                    audioChunksRef.current = [];

                    // Store recorded audio chunks
                    mediaRecorder.ondataavailable = (event) => {
                        if (event.data.size > 0) {
                            console.log("Audio chunk recorded:", event.data);
                            audioChunksRef.current.push(event.data);
                        }
                    };

                    mediaRecorder.start();
                    console.log("Recording started...");
                })
                .catch((error) => console.error("Error accessing microphone:", error));
        });

        // Stop recording when the meeting ends
        api.addEventListener("readyToClose", () => {
            console.log("Meeting ended. Stopping recording...");

            if (mediaRecorderRef.current) {
                mediaRecorderRef.current.stop();
                mediaRecorderRef.current.onstop = () => {
                    console.log("Recording stopped. Processing recorded audio...");

                    // Combine the chunks into one Blob
                    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                    console.log("Final recorded audio Blob:", audioBlob);
                    console.log("Blob size:", audioBlob.size, "Blob type:", audioBlob.type);

                    sendAudioToBackend(audioBlob); // Send the audio to OpenAI Whisper API
                };
            }

            api.dispose();
            navigate("/");
        });

        return () => api.dispose();
    }, [roomName, configOverwrite, userInfo, navigate]);

    const sendAudioToBackend = async (audioBlob) => {
        const formData = new FormData();
        formData.append("audio", audioBlob, "meeting_audio.webm");
        formData.append("meetingId", meetingId);

        try {
            const response = await axios.post("http://localhost:4000/api/summaries/upload-audio", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Audio file uploaded successfully:", response.data);
        } catch (error) {
            console.error("Error uploading audio file:", error);
        }
    };

    return <div ref={jitsiContainer} style={{ width: "100%", height: "500px" }} />;
};

export default JitsiMeet;
