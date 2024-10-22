"use client";
import { Inter } from "next/font/google";
import {
  GlobalContextUserProvider,
} from "./context/UserDataContext";
import "./globals.css";
import { MapProvider } from "./game/mode/play/contexts/MapContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  GlobalSocket,
  GlobalWebsocketProvider,
} from "./context/GlobalSocket";
import { GlobalRenderNotifProvider } from "./context/renderNotif";
import {
  GlobalOnlineSocket,
  GlobalOnlinesocketProvider,
} from "./context/online-status";
import { OnlineStateProvider } from "./context/online-status-state";
const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GlobalRenderNotifProvider>
          <OnlineStateProvider>
            <GlobalWebsocketProvider value={GlobalSocket}>
              <GlobalOnlinesocketProvider value={GlobalOnlineSocket}>
                <MapProvider>
                  <GlobalContextUserProvider>
                    {children}
                    <ToastContainer />
                  </GlobalContextUserProvider>
                </MapProvider>
              </GlobalOnlinesocketProvider>
            </GlobalWebsocketProvider>
          </OnlineStateProvider>
        </GlobalRenderNotifProvider>
      </body>
    </html>
  );
}
