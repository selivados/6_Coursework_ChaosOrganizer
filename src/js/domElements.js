export const chat = document.querySelector(".chat");
export const chatWindow = chat.querySelector(".chat-window");
export const messagesList = chatWindow.querySelector(".messages-list");
export const dropZone = chatWindow.querySelector(".drop-zone");
export const chatForm = chat.querySelector(".chat-form");
export const formInput = chatForm.querySelector(".form-input");
export const fileInput = chatForm.querySelector(".file-input");

export const fileButton = chatForm.querySelector(".file-button");
export const geoButton = chatForm.querySelector(".geo-button");
export const audioButton = chatForm.querySelector(".audio-button");
export const recAudioButton = chatForm.querySelector(".rec-audio-button");
export const stopAudioButton = chatForm.querySelector(".stop-audio-button");
export const videoButton = chatForm.querySelector(".video-button");
export const recVideoButton = chatForm.querySelector(".rec-video-button");
export const stopVideoButton = chatForm.querySelector(".stop-video-button");
export const sendButton = chatForm.querySelector(".send-button");
export const indicator = chatForm.querySelector(".indicator");

export const enableAllControls = () => {
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

export const disableAllControls = () => {
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
