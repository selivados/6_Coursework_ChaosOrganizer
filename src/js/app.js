import { getUserId } from "./user";
import { activateMessage } from "./message";
import { activateFile } from "./file";
import { activateGeo } from "./geo";
import { activateAudio } from "./audio";
import { activateVideo } from "./video";
import { activateDnD } from "./dnd";
import { activateWebsocket } from "./websocket";

// const baseUrl = "ws://localhost:7070/ws";
const baseUrl = "wss://chaos-organizer-backend-server.onrender.com";
export const ws = new WebSocket(baseUrl);

export const userId = getUserId();

activateMessage();
activateFile();
activateGeo();
activateAudio();
activateVideo();
activateDnD();
activateWebsocket();
