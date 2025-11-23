import { io } from "socket.io-client";

export function connectWebSocket() {
  return io("http://localhost:9000", { withCredentials: true }); // backend url
}
