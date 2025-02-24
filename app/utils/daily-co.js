import axios from "axios";

const API_KEY = "YOUR_DAILY_API_KEY";

async function createRoom() {
    const response = await axios.post("https://api.daily.co/v1/rooms", {
        privacy: "private",
    }, {
        headers: { Authorization: `Bearer ${API_KEY}` },
    });

    console.log("Room created:", response.data.url);
    return response.data.url;
}

await axios.post("https://api.daily.co/v1/rooms", {
    properties: {
        enable_recording: "cloud",  // Enable cloud recording
    }
}, {
    headers: { Authorization: `Bearer ${API_KEY}` },
});

createRoom();
