import { ws, userId } from "./app";
import {
  audioButton,
  recAudioButton,
  stopAudioButton,
  recVideoButton,
  stopVideoButton,
  enableAllControls,
  disableAllControls,
} from "./domElements";

export const activateAudio = () => {
  audioButton.addEventListener("click", () => {
    recAudioButton.classList.toggle("hidden");
    stopAudioButton.classList.toggle("hidden");

    recVideoButton.classList.add("hidden");
    stopVideoButton.classList.add("hidden");
  });

  recAudioButton.addEventListener("click", async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const recorder = new MediaRecorder(stream);
    const chunks = [];

    recorder.addEventListener("start", () => {
      disableAllControls();
      stopAudioButton.disabled = false;
    });

    recorder.addEventListener("dataavailable", (e) => {
      chunks.push(e.data);
    });

    recorder.addEventListener("stop", () => {
      const blob = new Blob(chunks, { type: "audio/mpeg" });
      const reader = new FileReader();

      reader.addEventListener("load", (e) => {
        const content = e.target.result;

        const newMessage = {
          from: userId,
          type: `file/audio`,
          textContent: "audio_record.mpeg",
          blobContent: content,
        };

        ws.send(JSON.stringify({ message: newMessage }));
      });

      reader.readAsDataURL(blob);
    });

    recorder.start();

    stopAudioButton.addEventListener("click", () => {
      recorder.stop();
      stream.getTracks().forEach((track) => track.stop);

      recAudioButton.classList.add("hidden");
      stopAudioButton.classList.add("hidden");

      enableAllControls();
      stopAudioButton.disabled = true;
      stopVideoButton.disabled = true;
    });
  });
};
