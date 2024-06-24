import moment from "moment";

import { ws, userId } from "./app";
import { chatForm, formInput } from "./domElements";

export const activateMessage = () => {
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sendMessageHandler();
  });
};

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
