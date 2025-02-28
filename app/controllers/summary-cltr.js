import Summary from "../models/summary-model.js";
import axios from "axios";
import fs from "fs";
import dotenv from "dotenv";
import cloudinary from "../utils/cloudinary.js"; // Import your Cloudinary config

dotenv.config();
const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;
const COHERE_API_KEY = process.env.COHERE_API_KEY; // Add this in .env

const summaryCltr = {};

summaryCltr.createAudio = async (req, res) => {
    const audioFile = req.file;

    console.log(req.body)
    if (!audioFile) {
        return res.status(400).json({ message: "No audio file uploaded." });
    }

    try {
        console.log("📤 Uploading audio file to Cloudinary...");

        // ✅ Step 1: Upload to Cloudinary
        const cloudinaryResult = await cloudinary.uploader.upload(audioFile.path, {
            folder: "meeting-audio/",
            resource_type: "video", // Cloudinary treats audio as video
            use_filename: true,
            unique_filename: false,
        });

        const audioUrl = cloudinaryResult.secure_url;
        console.log("✅ Uploaded to Cloudinary:", audioUrl);

        // ✅ Step 2: Delete Local File
        fs.unlinkSync(audioFile.path);

        console.log("📤 Sending audio file to AssemblyAI for transcription...");

        // ✅ Step 3: Send file to AssemblyAI for transcription
        const assemblyResponse = await axios.post("https://api.assemblyai.com/v2/transcript",
            { audio_url: audioUrl },
            {
                headers: { Authorization: ASSEMBLYAI_API_KEY, "Content-Type": "application/json" },
            }
        );

        const transcriptId = assemblyResponse.data.id;
        console.log("✅ Transcription request submitted. ID:", transcriptId);

        // ✅ Step 4: Poll AssemblyAI API to get the transcript
        let transcriptText = "";
        while (true) {
            await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 sec before checking

            const transcriptStatus = await axios.get(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
                headers: { Authorization: ASSEMBLYAI_API_KEY },
            });

            if (transcriptStatus.data.status === "completed") {
                transcriptText = transcriptStatus.data.text;
                console.log("✅ Transcription completed:", transcriptText);
                break;
            } else if (transcriptStatus.data.status === "failed") {
                throw new Error("Transcription failed on AssemblyAI.");
            }
        }

        // ✅ Step 5: Generate Summary with Cohere API
        console.log("📝 Generating summary with Cohere API...");
        try {
            const cohereResponse = await axios.post("https://api.cohere.ai/v1/summarize", {
                text: transcriptText,
                length: "long", // Options: "short", "medium", "long"
                format: "paragraph", // Options: "bullets", "paragraph"
            }, {
                headers: {
                    Authorization: `Bearer ${COHERE_API_KEY}`,
                    "Content-Type": "application/json",
                }
            });

            const summary = cohereResponse.data.summary;
            console.log("✅ Summary generated:", summary);


            // ✅ Step 6: Save to Database
            const summaryData = new Summary({
                meetingId: req.body.meetingId,
                mentorId: req.body.mentorId,
                menteeId: req.body.menteeId,
                audioUrl: audioUrl, // Store Cloudinary audio URL
                transcript: transcriptText,
                summary: summary,
            });

            await summaryData.save();
            return res.json(summaryData);

        } catch (error) {
            console.error("❌ Failed to generate summary:", error);
            return res.status(500).json({ error: "Failed to generate summary with Cohere: " + error.message });
        }

    } catch (err) {
        console.error("❌ Error:", err);
        return res.status(500).json({ error: err.message });
    }
};

summaryCltr.getSummary = async (req, res) => {
    const menteeId = req.params.menteeId
    try {
        const summary = await Summary.find({ menteeId }).populate('meetingId').populate('mentorId').populate('menteeId')
        if (!summary) {
            return res.status(404).json('summary not found')
        }
        return res.status(200).json(summary)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

export default summaryCltr;
