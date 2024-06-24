import { ws, userId } from "./app";
import { geoButton } from "./domElements";

export const activateGeo = () => {
  geoButton.addEventListener("click", () => {
    sendGeoPositionHandler();
  });
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
