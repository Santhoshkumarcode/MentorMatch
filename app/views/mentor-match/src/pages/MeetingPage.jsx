import { useParams } from "react-router-dom";
import JitsiMeet from "../components/VideoCall"
import { useSelector } from "react-redux";
import axios from "axios";

export default function MeetingPage() {
    const { mentorId, menteeId } = useParams();
    const currentUserId = useSelector((state) => state?.users?.data?._id);

    if (!mentorId || !menteeId || !currentUserId) {
        return <p>loading</p>
    }

    const roomName = `MentorMentee_${mentorId}_${menteeId}`


    return (
        <>
            <JitsiMeet
                roomName={roomName}
                configOverwrite={{
                    startWithAudioMuted: false,
                    startWithVideoMuted: true,
                    prejoinPageEnabled: false,
                    startAudioOnly: false,
                    disableInviteFunctions: true,
                    lobbyMode: false,
                    disableLobby: true,
                }}
                userInfo={{
                    displayName: currentUserId === mentorId ? "Mentor" : "Mentee",
                }}

            />
        </>
    )
}