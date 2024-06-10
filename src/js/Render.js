import L from "leaflet";
import moment from "moment";

export default class Render {
  constructor(messagesListEl, userId) {
    this.messagesListEl = messagesListEl;
    this.userId = userId;
  }

  getTime(timestamp) {
    const created = moment(timestamp);
    const today = moment();

    if (created.isBefore(today, "day")) {
      return created.format("DD.MM.YYYY HH:mm");
    }

    return created.format("HH:mm");
  }

  markupTextEl(message) {
    const textEl = document.createElement("div");
    textEl.classList.add("message-text");
    textEl.innerHTML = message.textContent;
    return textEl;
  }

  markupDateEl(message) {
    const dateEl = document.createElement("div");
    dateEl.classList.add("message-date");
    dateEl.textContent = this.getTime(message.created);
    return dateEl;
  }

  markupGeoEl(message) {
    const geoEl = document.createElement("div");
    geoEl.classList.add("message-geo");
    geoEl.id = message.id;
    return geoEl;
  }

  markupImageEl(message) {
    const imageEl = document.createElement("img");
    imageEl.classList.add("message-image");
    imageEl.textContent = message.textContent;
    imageEl.src = message.blobContent;
    return imageEl;
  }

  markupDownloadEl(message) {
    const downloadEl = document.createElement("a");
    downloadEl.classList.add("download-button");
    downloadEl.href = message.blobContent;
    downloadEl.download = message.textContent;
    downloadEl.textContent = "Скачать";
    return downloadEl;
  }

  markupAudioEl(message) {
    const audioEl = document.createElement("audio");
    audioEl.classList.add("message-audio");
    audioEl.src = message.blobContent;
    audioEl.controls = true;
    return audioEl;
  }

  markupVideoEl(message) {
    const videoEl = document.createElement("video");
    videoEl.classList.add("message-video");
    videoEl.src = message.blobContent;
    videoEl.controls = true;
    return videoEl;
  }

  markupFileEl() {
    const fileEl = document.createElement("div");
    fileEl.classList.add("file-icon");
    return fileEl;
  }

  addMap(message) {
    const coordinates = [message.latitude, message.longitude];

    const map = L.map(message.id).setView(coordinates, 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    const marker = L.marker(map.getCenter()).addTo(map);
    marker.setLatLng(map.getCenter());
  }

  renderMessage(message, isOldMessage) {
    const isCreator = message.from === this.userId;

    const messageEl = document.createElement("li");
    const messageContentEl = document.createElement("div");

    if (isCreator) {
      messageEl.classList.add("message", "message-creator");
      messageContentEl.classList.add(
        "message-content",
        "message-content-creator",
      );
    } else {
      messageEl.classList.add("message");
      messageContentEl.classList.add("message-content");
    }

    switch (message.type) {
      case "message/text":
        messageContentEl.appendChild(this.markupTextEl(message));
        break;
      case "message/geo":
        messageContentEl.appendChild(this.markupGeoEl(message));
        messageContentEl.appendChild(this.markupTextEl(message));
        break;
      case "file/image":
        messageContentEl.appendChild(this.markupImageEl(message));
        messageContentEl.appendChild(this.markupTextEl(message));
        messageContentEl.appendChild(this.markupDownloadEl(message));
        break;
      case "file/audio":
        messageContentEl.appendChild(this.markupAudioEl(message));
        messageContentEl.appendChild(this.markupTextEl(message));
        messageContentEl.appendChild(this.markupDownloadEl(message));
        break;
      case "file/video":
        messageContentEl.appendChild(this.markupVideoEl(message));
        messageContentEl.appendChild(this.markupTextEl(message));
        messageContentEl.appendChild(this.markupDownloadEl(message));
        break;
      default:
        messageContentEl.appendChild(this.markupFileEl(message));
        messageContentEl.appendChild(this.markupTextEl(message));
        messageContentEl.appendChild(this.markupDownloadEl(message));
        break;
    }

    messageContentEl.appendChild(this.markupDateEl(message));

    messageEl.appendChild(messageContentEl);

    isOldMessage
      ? this.messagesListEl.insertAdjacentElement("beforeend", messageEl)
      : this.messagesListEl.insertAdjacentElement("afterbegin", messageEl);

    if (message.type === "message/geo") {
      this.addMap(message);
    }
  }
}
