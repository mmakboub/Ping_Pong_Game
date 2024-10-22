"use client";
import React, { useContext, useEffect } from "react";
import NavBar from "../components/NavBar/navBar";
import Header from "../components/Header/Header";
import { GlobalOnlineSocketContext } from "../context/online-status";
import { useOnlineStatusContext } from "../context/online-status-state";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const onlineSocket = useContext(GlobalOnlineSocketContext);
  const { setStatus } = useOnlineStatusContext();
  useEffect(() => {
    onlineSocket.emit("checkStatus");
    onlineSocket.on(
      "get-status",
      (data: { status: string; userId: string }[]) => {
        setStatus(() => data);
      }
    );
    return () => {
      onlineSocket.off("get-status");
    };
  }, [onlineSocket, setStatus]);
  return (
    <main className="fixed flex h-screen w-screen flex-col-reverse md:flex-row">
      {/* main content */}
      <NavBar />
      <div className="flex h-full w-full flex-col gap-5 overflow-hidden px-5 pb-5">
        <Header />

        {/* content  */}
        {children}
      </div>
    </main>
  );
};

export default Layout;
