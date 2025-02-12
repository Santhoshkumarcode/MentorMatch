import Summary from "../models/summary-model.js";
import axios from "axios"
import fs from 'fs';
import FormData from 'form-data'; 

const summaryCltr = {}

const OPENAI_WHISPER_API_URL = "https://api.openai.com/v1/audio/transcriptions"; // OpenAI Whisper API URL
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

summaryCltr.createAudio = async (req, res) => {
    const audioFile = req.file
    if (!audioFile) {
        return res.status(400).json({ message: "No audio file uploaded." });
    }

    try {
        console.log(audioFile)
        const formData = new FormData();
        formData.append('file', fs.createReadStream(audioFile.path));  // Add the audio file to FormData
        formData.append('model', 'whisper-1');

        const response = await axios.post(OPENAI_WHISPER_API_URL, formData, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,  // Set your OpenAI API key in the header
                ...formData.getHeaders(),  // Include the necessary headers for FormData
            },
        });


        const transcript = response.data.text;

        const summaryResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",  // You can also use "gpt-4"
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: `Please summarize the following transcript: ${transcript}` }
            ],
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        const summary = summaryResponse.data.choices[0].message.content;  // Get the summarized content

        // Step 5: Save the transcript (and summary) to the database
        const summaryData = new Summary({
            meetingId: req.body.meetingId,
            transcript: transcript,  // Save the full transcript
            summary: summary,  // Save the summary (if needed)
        });

        await summaryData.save();  // Save the data in the database

        // Step 6: Return the saved summary (and transcript)
        return res.json(summaryData);
        
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

export default summaryCltr