import { ws, userId } from "./app";
import {
  videoButton,
  recVideoButton,
  stopVideoButton,
  recAudioButton,
  stopAudioButton,
  enableAllControls,
  disableAllControls,
} from "./domElements";

export const activateVideo = () => {
  videoButton.addEventListener("click", () => {
    recVideoButton.classList.toggle("hidden");
    stopVideoButton.classList.toggle("hidden");

    recAudioButton.classList.add("hidden");
    stopAudioButton.classList.add("hidden");
  });

  recVideoButton.addEventListener("click", async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    const recorder = new MediaRecorder(stream);
    const chunks = [];

    recorder.addEventListener("start", () => {
      disableAllControls();
      stopVideoButton.disabled = false;
    });

    recorder.addEventListener("dataavailable", (e) => {
      chunks.push(e.data);
    });

    recorder.addEventListener("stop", () => {
      const blob = new Blob(chunks, { type: "video/mp4" });
      const reader = new FileReader();

      reader.addEventListener("load", (e) => {
        const content = e.target.result;

        const newMessage = {
          from: userId,
          type: `file/video`,
          textContent: "video_record.mp4",
          blobContent: content,
        };

        ws.send(JSON.stringify({ message: newMessage }));
      });

      reader.readAsDataURL(blob);
    });

    recorder.start();

    stopVideoButton.addEventListener("click", () => {
      recorder.stop();
      stream.getTracks().forEach((track) => track.stop);

      recVideoButton.classList.add("hidden");
      stopVideoButton.classList.add("hidden");

      enableAllControls();
      stopAudioButton.disabled = true;
      stopVideoButton.disabled = true;
    });
  });
};
