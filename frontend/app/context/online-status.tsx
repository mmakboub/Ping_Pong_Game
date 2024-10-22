import { createContext } from "react";
import { io, Socket } from "socket.io-client";

const WEBSOCKET_URL = `${process.env.NEXT_PUBLIC_API_URL}:4000/online-status`;
export const GlobalOnlineSocket = io(WEBSOCKET_URL, {
  autoConnect: false,
  // withCredentials: true,
  // reconnection: true,
  // reconnectionAttempts: 5,
  // reconnectionDelay: 1000,
  // reconnectionDelayMax: 5000,
  // randomizationFactor: 0.5,
});
export const GlobalOnlineSocketContext =
  createContext<Socket>(GlobalOnlineSocket);
export const GlobalOnlinesocketProvider = GlobalOnlineSocketContext.Provider;
