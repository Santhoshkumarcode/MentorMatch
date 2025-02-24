import DailyIframe from "@daily-co/daily-js";
import { useEffect, useRef } from "react";

export default function VideoCall({ roomUrl }) {
    const videoRef = useRef(null);

    useEffect(() => {
        const callFrame = DailyIframe.createFrame(videoRef.current, {
            url: roomUrl,
            showLeaveButton: true,
        });

        callFrame.join();
        return () => callFrame.destroy();
    }, [roomUrl]);

    return <div ref={videoRef} style={{ width: "100%", height: "500px" }} />;
}
