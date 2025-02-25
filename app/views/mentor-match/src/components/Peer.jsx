import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { useSelector } from "react-redux";
import axios from "../config/axios";

const VideoChat = () => {
    const { mentorId, menteeId } = useParams();
    const navigate = useNavigate();

    const currentUserId = useSelector((state) => state?.users?.data?._id);
    const isMentor = currentUserId === mentorId;

    const myVideoRef = useRef();
    const remoteVideoRef = useRef();
    const mediaRecorderRef = useRef(null);
    const recordedChunksRef = useRef([]);

    const [peer, setPeer] = useState(null);
    const [callConnected, setCallConnected] = useState(false);

    useEffect(() => {
        const newPeer = new Peer(currentUserId, {
            host: "0.peerjs.com",
            port: 443,
            secure: true,
        });

        newPeer.on("open", (id) => {
            console.log("My Peer ID:", id);
        });

        newPeer.on("call", async (call) => {
            console.log("Incoming call...");
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

                if (myVideoRef.current) myVideoRef.current.srcObject = stream;
                call.answer(stream);
                call.on("stream", (remoteStream) => {
                    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
                    setCallConnected(true);
                });

                startRecording(stream); // Start recording when the call starts
            } catch (error) {
                console.error("Error accessing media devices:", error);
                alert("Error: " + error.message);
            }
        });

        setPeer(newPeer);
        return () => newPeer.destroy();
    }, [currentUserId]);

    const callUser = async () => {
        if (!peer) {
            alert("Peer connection not established yet.");
            return;
        }

        const remoteId = isMentor ? menteeId : mentorId;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (myVideoRef.current) myVideoRef.current.srcObject = stream;

            const call = peer.call(remoteId, stream);
            call.on("stream", (remoteStream) => {
                if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
                setCallConnected(true);
            });

            startRecording(stream); // Start recording when the call starts
        } catch (error) {
            console.error("Error accessing media devices:", error);
            alert("Error: " + error.message);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            callUser();
        }, 3000);

        return () => clearTimeout(timeout);
    }, [peer]);

    // 🔴 Start Recording Audio
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); // Ensure only audio is captured
            const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

            recordedChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.start();
            mediaRecorderRef.current = mediaRecorder;
            console.log("Recording started...");
        } catch (error) {
            console.error("Error accessing microphone:", error);
            alert("Microphone access denied or not available.");
        }
    };


    // 🛑 Stop Recording and Send Audio to Backend
    const stopRecordingAndSendAudio = async () => {
        return new Promise((resolve) => {
            if (mediaRecorderRef.current) {
                mediaRecorderRef.current.onstop = async () => {
                    const audioBlob = new Blob(recordedChunksRef.current, { type: "audio/webm" });
                    const audioFile = new File([audioBlob], "meeting_audio.webm", { type: "audio/webm" });

                    const formData = new FormData();
                    formData.append("audio", audioFile);
                    formData.append("meetingId", `${mentorId}-${menteeId}`);

                    try {
                        console.log("Uploading audio...");
                        const response = await axios.post("/api/summaries/upload-audio", formData, {
                            headers: { "Content-Type": "multipart/form-data" },
                        });
                        console.log("Transcript and summary saved:", response.data);
                    } catch (error) {
                        console.error("Error uploading audio:", error);
                    }

                    resolve();
                };
                mediaRecorderRef.current.stop();
            } else {
                resolve();
            }
        });
    };

    // 🛑 End Call
    const endCall = async () => {
        await stopRecordingAndSendAudio(); // Stop recording and send audio to backend
        if (peer) {
            peer.destroy();
        }
        navigate("/");
    };

    return (
        <div className="flex flex-col items-center p-4">
            <h2 className="text-xl font-bold">Video Call</h2>

            <div className="flex justify-center gap-6 mt-4">
                <div className="flex flex-col items-center">
                    <h3 className="font-semibold">{isMentor ? "You (Mentor)" : "Mentor"}</h3>
                    <video ref={isMentor ? myVideoRef : remoteVideoRef}
                        autoPlay
                        playsInline
                        className="border w-[600px] h-[400px]" />
                </div>
                <div className="flex flex-col items-center">
                    <h3 className="font-semibold">{!isMentor ? "You (Mentee)" : "Mentee"}</h3>
                    <video ref={!isMentor ? myVideoRef : remoteVideoRef}
                        autoPlay
                        playsInline
                        className="border w-[600px] h-[400px]" />
                </div>
            </div>

            <button onClick={endCall} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
                End Call
            </button>
        </div>
    );
};

export default VideoChat;