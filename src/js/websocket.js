import { ws, userId } from "./app";
import {
  chatWindow,
  messagesList,
  stopAudioButton,
  stopVideoButton,
  indicator,
  enableAllControls,
  disableAllControls,
} from "./domElements";
import { Render } from "./Render";
import { notification } from "./notification";

export const activateWebsocket = () => {
  const render = new Render(messagesList, userId);

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
};

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
