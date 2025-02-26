import Summary from "../models/summary-model.js";
import axios from "axios";
import fs from "fs";
import dotenv from "dotenv";
import cloudinary from "../utils/cloudinary.js"; // Import your Cloudinary config

dotenv.config();
const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY; // Add this in .env

const summaryCltr = {};

summaryCltr.createAudio = async (req, res) => {
    const audioFile = req.file;

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

        // ✅ Step 5: Generate Summary with Hugging Face
        console.log("📝 Generating summary with Hugging Face...");



        

        const huggingFaceResponse = await axios.post(
            "https://api-inference.huggingface.co/models/facebook/bart-large-cnn", 
            { inputs: transcriptText },
            {
                headers: { Authorization: `Bearer ${HUGGINGFACE_API_KEY}` },
            }
        );

        if (!huggingFaceResponse.data || !huggingFaceResponse.data[0].summary_text) {
            throw new Error("Failed to get summary from Hugging Face.");
        }

        const summary = huggingFaceResponse.data[0].summary_text;
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

    } catch (err) {
        console.error("❌ Error:", err);
        return res.status(500).json({ error: err.message });
    }
};

export default summaryCltr;