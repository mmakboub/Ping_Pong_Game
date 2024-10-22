import { createContext } from "react";
import { io, Socket } from "socket.io-client";

const WEBSOCKET_URL = `${process.env.NEXT_PUBLIC_API_URL}:4000/notification`;
export const GlobalSocket = io(WEBSOCKET_URL, {
  autoConnect: false,
  reconnection: true,
});
export const GlobalWebSocketContext = createContext<Socket>(GlobalSocket);
export const GlobalWebsocketProvider = GlobalWebSocketContext.Provider;
