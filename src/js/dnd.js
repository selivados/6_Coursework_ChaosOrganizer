import { chatWindow, dropZone } from "./domElements";
import { sendFileHandler } from "./file";

export const activateDnD = () => {
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
};
