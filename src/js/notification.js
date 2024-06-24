export async function notification(message) {
  if (!window.Notification) {
    return;
  }

  if (Notification.permission === "granted") {
    console.log("Notification permission already granted");
    showNotification(message);
    return;
  }

  if (Notification.permission === "default") {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      console.log("Notification permission granted after request");
      showNotification(message);
      return;
    }

    console.log("Notification permission denied");
  }
}

function showNotification(message) {
  const notification = new Notification("Новое сообщение", {
    body: message.textContent,
    // icon: "./img/notification-icon.png",
    requireInteraction: true,
  });

  notification.addEventListener("click", () => {
    notification.close();
  });
}
