const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
const mediaRecorder = new MediaRecorder(stream);
let audioChunks = [];

mediaRecorder.ondataavailable = (event) => {
    audioChunks.push(event.data);
};

mediaRecorder.onstop = async () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
    const audioFile = new File([audioBlob], "meeting_audio.wav");
    // Upload the audio file to your backend
};

mediaRecorder.start();
