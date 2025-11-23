import { io } from "socket.io-client";

export function connectWebSocket() {
  return io("https://e-learning-platform-ht9m.onrender.com", { withCredentials: true }); // backend url
}
