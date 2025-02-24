export const create = async (req, res) => {

    const DAILY_API_KEY = process.env.DAILY_API_KEY;

    try {
        const { menteeId, mentorId } = req.body;
        const roomName = `mentorship_${menteeId}_${mentorId}`;

        // Check if room exists
        const rooms = await axios.get("https://api.daily.co/v1/rooms", {
            headers: { Authorization: `Bearer ${DAILY_API_KEY}` }
        });

        let existingRoom = rooms.data.rooms.find(room => room.name === roomName);

        if (existingRoom) {
            return res.json({ roomUrl: existingRoom.url });
        }

        // If room does not exist, create a new one
        const response = await axios.post("https://api.daily.co/v1/rooms", {
            name: roomName,
            privacy: "private",
            properties: { enable_recording: "cloud" }
        }, {
            headers: { Authorization: `Bearer ${DAILY_API_KEY}` }
        });

        res.json({ roomUrl: response.data.url });
    } catch (error) {
        console.error("Error creating room:", error);
        res.status(500).json({ error: "Failed to create room" });
    }
}

export const transcript = async (req, res) => {
    const DAILY_API_KEY = process.env.DAILY_API_KEY;

    try {
        const { recording_file, meetingId } = req.body;

        if (!recording_file) return res.status(400).send("No recording file.");

        console.log("Recording URL received:", recording_file);

        // Send audio to OpenAI Whisper
        const transcript = await sendAudioToOpenAI(recording_file);
        const summary = await generateSummary(transcript);

        res.json({ transcript, summary });
    } catch (error) {
        console.error("Error processing recording:", error);
        res.status(500).json({ error: "Failed to process recording" });
    }
}

// Function to send audio to OpenAI Whisper
async function sendAudioToOpenAI(audioUrl) {
    const response = await axios.get(audioUrl, { responseType: "arraybuffer" });
    fs.writeFileSync("meeting_audio.mp3", response.data);

    const formData = new FormData();
    formData.append("file", fs.createReadStream("meeting_audio.mp3"));
    formData.append("model", "whisper-1");

    const openaiResponse = await axios.post("https://api.openai.com/v1/audio/transcriptions", formData, {
        headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            ...formData.getHeaders(),
        },
    });

    return openaiResponse.data.text;
}

// Function to generate a summary using OpenAI GPT
async function generateSummary(transcript) {
    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
        model: "gpt-4",
        messages: [
            { role: "system", content: "You are an AI that summarizes meetings." },
            { role: "user", content: `Summarize this meeting: ${transcript}` },
        ],
    }, {
        headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
        },
    });

    return response.data.choices[0].message.content;
}