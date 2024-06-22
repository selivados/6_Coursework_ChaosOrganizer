import getUserId from "./user";
import notification from "./notification";
import Render from "./Render";
import moment from "moment";

// const baseUrl = "ws://localhost:7070/ws";
const baseUrl = "wss://chaos-organizer-backend-server.onrender.com";
const ws = new WebSocket(baseUrl);

const userId = getUserId();

const chat = document.querySelector(".chat");
const chatWindow = chat.querySelector(".chat-window");
const messagesList = chatWindow.querySelector(".messages-list");
const dropZone = chatWindow.querySelector(".drop-zone");
const chatForm = chat.querySelector(".chat-form");
const formInput = chatForm.querySelector(".form-input");
const fileInput = chatForm.querySelector(".file-input");

const fileButton = chatForm.querySelector(".file-button");
const geoButton = chatForm.querySelector(".geo-button");
const audioButton = chatForm.querySelector(".audio-button");
const recAudioButton = chatForm.querySelector(".rec-audio-button");
const stopAudioButton = chatForm.querySelector(".stop-audio-button");
const videoButton = chatForm.querySelector(".video-button");
const recVideoButton = chatForm.querySelector(".rec-video-button");
const stopVideoButton = chatForm.querySelector(".stop-video-button");
const sendButton = chatForm.querySelector(".send-button");
const indicator = chatForm.querySelector(".indicator");

const render = new Render(messagesList, userId);

const sendMessageHandler = () => {
  const text = formInput.value.trim();

  if (!text) return;

  if (text.startsWith("@schedule:")) {
    const itemsArray = text.split(/\s+/);

    if (itemsArray.length < 4) return;

    const today = moment();
    const alertTime = moment(
      `${itemsArray[1]} ${itemsArray[2]}`,
      [
        "HH:mm DD.MM.YYYY",
        "HH:mm D.MM.YYYY",
        "H:mm DD.MM.YYYY",
        "H:mm D.MM.YYYY",
        "DD.MM.YYYY HH:mm",
        "DD.MM.YYYY H:mm",
        "D.MM.YYYY HH:mm",
        "D.MM.YYYY H:mm",
      ],
      true,
    );
    const textContent = itemsArray.slice(3).join(" ");

    if (alertTime.isValid && alertTime.isAfter(today) && textContent) {
      const newMessage = {
        from: userId,
        alertTime,
        textContent,
      };

      ws.send(JSON.stringify({ reminder: newMessage }));
    }
  } else {
    const textArray = text.split(/\s+/).map((item) => {
      if (item.startsWith("http://") || item.startsWith("https://")) {
        return `<a href=${item} target="_blank" rel="noopener noreferrer">${item}</a>`;
      }

      return item;
    });

    const newMessage = {
      from: userId,
      type: "message/text",
      textContent: textArray.join(" "),
    };

    ws.send(JSON.stringify({ message: newMessage }));
  }

  formInput.value = "";
};

const sendFileHandler = (file) => {
  const reader = new FileReader();

  reader.addEventListener("load", (e) => {
    const content = e.target.result;
    const type = content.includes("application")
      ? "application"
      : content.match(/:([^/]+)/)[1];

    const newMessage = {
      from: userId,
      type: `file/${type}`,
      textContent: file.name,
      blobContent: content,
    };

    ws.send(JSON.stringify({ message: newMessage }));
  });

  reader.readAsDataURL(file);
};

const sendGeoPositionHandler = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const newMessage = {
          from: userId,
          type: "message/geo",
          latitude,
          longitude,
          textContent: `Координаты: ${latitude}°, ${longitude}°`,
        };

        ws.send(JSON.stringify({ message: newMessage }));
      },
      (error) => {
        console.log(error);
      },
      { enableHighAccuracy: true },
    );
  }
};

fileButton.addEventListener("click", () => {
  fileInput.dispatchEvent(new MouseEvent("click"));
});

fileInput.addEventListener("change", () => {
  const files = Array.from(fileInput.files);

  if (files) {
    files.forEach((file) => sendFileHandler(file));
  }
});

geoButton.addEventListener("click", () => {
  sendGeoPositionHandler();
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessageHandler();
});

document.addEventListener("dragover", (e) => {
  e.preventDefault();
});

document.addEventListener("drop", (e) => {
  e.preventDefault();
});

chatWindow.addEventListener("dragenter", () => {
  dropZone.classList.remove("hidden");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.add("hidden");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();

  const files = Array.from(e.dataTransfer.files);

  if (files) {
    files.forEach((file) => sendFileHandler(file));
  }

  dropZone.classList.add("hidden");
});

const enableAllControls = () => {
  fileButton.disabled = false;
  geoButton.disabled = false;
  audioButton.disabled = false;
  recAudioButton.disabled = false;
  stopAudioButton.disabled = false;
  videoButton.disabled = false;
  recVideoButton.disabled = false;
  stopVideoButton.disabled = false;
  formInput.disabled = false;
  sendButton.disabled = false;
};

const disableAllControls = () => {
  fileButton.disabled = true;
  geoButton.disabled = true;
  audioButton.disabled = true;
  recAudioButton.disabled = true;
  stopAudioButton.disabled = true;
  videoButton.disabled = true;
  recVideoButton.disabled = true;
  stopVideoButton.disabled = true;
  formInput.disabled = true;
  sendButton.disabled = true;
};

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
        textContent: "audio_record.mp3",
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

const messagesScrollHandler = () => {
  const chatWindowTopCoord = chatWindow.getBoundingClientRect().top;
  const firstMessageTopCoord =
    messagesList.lastChild.getBoundingClientRect().top;

  if (firstMessageTopCoord > chatWindowTopCoord + 10) {
    ws.send(
      JSON.stringify({
        getOldMessages: "Получить следующие 10 старых сообщений",
      }),
    );
  }
};

ws.addEventListener("close", () => {
  disableAllControls();

  indicator.style.backgroundColor = "red";
});

ws.addEventListener("error", () => {
  disableAllControls();

  indicator.style.backgroundColor = "red";
});

ws.addEventListener("open", () => {
  enableAllControls();
  stopAudioButton.disabled = true;
  stopVideoButton.disabled = true;

  indicator.style.backgroundColor = "green";
});

ws.addEventListener("message", (e) => {
  const data = JSON.parse(e.data);
  const { lastMessages, oldMessages, message, reminder } = data;

  if (lastMessages) {
    if (lastMessages.length > 0) {
      lastMessages.forEach((message) => render.renderMessage(message, false));
      messagesScrollHandler();
    }

    messagesList.addEventListener("scroll", () => {
      messagesScrollHandler();
    });
  }

  if (oldMessages) {
    oldMessages.forEach((message) => render.renderMessage(message, true));
  }

  if (message) {
    render.renderMessage(message, false);
  }

  if (reminder) {
    notification(reminder);
  }
});
