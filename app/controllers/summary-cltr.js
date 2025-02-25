// whisper

/* import Summary from "../models/summary-model.js";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const summaryCltr = {};

 summaryCltr.createAudio = async (req, res) => {
    const audioFile = req.file;
    if (!audioFile) {
        return res.status(400).json({ message: "No audio file uploaded." });
    }

    try {
        console.log("Uploading audio file to Whisper API...");

        // Step 1: Upload audio file to OpenAI Whisper for transcription
        const formData = new FormData();
        formData.append("file", fs.createReadStream(audioFile.path));
        formData.append("model", "whisper-1");

        const transcriptResponse = await axios.post("https://api.openai.com/v1/audio/transcriptions", formData, {
            headers: {
                ...formData.getHeaders(),
                Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
        });

        const transcriptText = transcriptResponse.data.text;
        console.log("Transcription done:", transcriptText);

        // Step 2: Get Summary using OpenAI GPT
        const summaryResponse = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: `Summarize this text: ${transcriptText}` },
            ],
        }, {
            headers: {
                Authorization: `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
        });

        const summary = summaryResponse.data.choices[0].message.content;

        // Step 3: Save to Database
        const summaryData = new Summary({
            meetingId: req.body.meetingId,
            transcript: transcriptText,
            summary: summary,
        });

        await summaryData.save();
        return res.json(summaryData);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
};
export default summaryCltr;

 */




//assambly AI

import Summary from "../models/summary-model.js";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import dotenv from "dotenv";

dotenv.config(); // Load API keys

const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

const summaryCltr = {};

summaryCltr.createAudio = async (req, res) => {
    const audioFile = req.file;
    console.log("Received audio file:", audioFile); 
    if (!audioFile) {
        return res.status(400).json({ message: "No audio file uploaded." });
    }

    try {
        console.log("🎤 Uploading audio file to AssemblyAI...");

        // Step 1: Upload audio to AssemblyAI
        const formData = new FormData();
        formData.append("file", fs.createReadStream(audioFile.path));

        const uploadResponse = await axios.post(
            "https://api.assemblyai.com/v2/upload",
            formData,
            {
                headers: {
                    Authorization: ASSEMBLYAI_API_KEY,
                    ...formData.getHeaders(),
                },
            }
        );

        if (!uploadResponse.data.upload_url) {
            throw new Error("❌ Upload failed. No URL received.");
        }

        const audioUrl = uploadResponse.data.upload_url;
        console.log("✅ Audio uploaded successfully:", audioUrl);

        // Step 2: Request transcription
        const transcriptResponse = await axios.post(
            "https://api.assemblyai.com/v2/transcript",
            { audio_url: audioUrl },
            {
                headers: {
                    Authorization: ASSEMBLYAI_API_KEY,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!transcriptResponse.data.id) {
            throw new Error("❌ Failed to start transcription.");
        }

        const transcriptId = transcriptResponse.data.id;
        console.log("📝 Transcription started, ID:", transcriptId);

        // Step 3: Poll for the transcript result
        let transcriptText = "";
        let retries = 30; // Max 4 minutes (30 x 8s = 240s)

        while (retries > 0) {
            try {
                const transcriptResult = await axios.get(
                    `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
                    {
                        headers: { Authorization: ASSEMBLYAI_API_KEY },
                    }
                );

                console.log(`🔄 Transcription Status: ${transcriptResult.data.status}`);

                if (transcriptResult.data.status === "completed") {
                    transcriptText = transcriptResult.data.text;
                    break;
                } else if (transcriptResult.data.status === "failed") {
                    console.error("❌ Transcription failed:", transcriptResult.data);
                    return res.status(500).json({ message: "Transcription failed." });
                }
            } catch (error) {
                console.error("⚠️ Error polling transcript:", error.response?.data || error.message);
                return res.status(500).json({ message: "Error fetching transcription status." });
            }

            await new Promise((resolve) => setTimeout(resolve, 8000)); // Wait 8 seconds before retrying
            retries--;
        }

        if (!transcriptText) {
            console.error("⏳ Timeout: Transcription took too long.");
            return res.status(500).json({ message: "Transcription timeout. Try again later." });
        }

        console.log("✅ Transcription completed:", transcriptText);

        // Step 4: Generate summary using Hugging Face
        console.log("📄 Generating summary...");
        const summaryResponse = await axios.post(
            "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
            { inputs: transcriptText },
            {
                headers: {
                    Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!summaryResponse.data || !summaryResponse.data[0]?.summary_text) {
            throw new Error("❌ Summary generation failed.");
        }

        const summary = summaryResponse.data[0].summary_text;
        console.log("✅ Summary generated:", summary);

        // Step 5: Save transcript & summary in MongoDB
        const summaryData = new Summary({
            meetingId: req.body.meetingId,
            transcript: transcriptText,
            summary: summary,
        });

        await summaryData.save();

        // Step 6: Clean up uploaded file
        fs.unlink(audioFile.path, (err) => {
            if (err) console.error("⚠️ Error deleting file:", err);
            else console.log("🗑 Temporary file deleted.");
        });

        return res.json(summaryData);
    } catch (err) {
        console.error("❌ Error:", err);
        return res.status(500).json({ error: err.message });
    }
};

export default summaryCltr;
