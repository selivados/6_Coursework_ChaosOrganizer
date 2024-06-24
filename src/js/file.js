import { ws, userId } from "./app";
import { fileButton, fileInput } from "./domElements";

export const activateFile = () => {
  fileButton.addEventListener("click", () => {
    fileInput.dispatchEvent(new MouseEvent("click"));
  });

  fileInput.addEventListener("change", () => {
    const files = Array.from(fileInput.files);

    if (files) {
      files.forEach((file) => sendFileHandler(file));
    }
  });
};

export const sendFileHandler = (file) => {
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
