import { createContext } from "react";
import { io, Socket } from "socket.io-client";

const WEBSOCKET_URL = `${process.env.NEXT_PUBLIC_API_URL}:4001`;
export const socket = io(WEBSOCKET_URL, {
  autoConnect: false,
});
export const WebsocketContext = createContext<Socket>(socket);
export const WebsocketProvider = WebsocketContext.Provider;
