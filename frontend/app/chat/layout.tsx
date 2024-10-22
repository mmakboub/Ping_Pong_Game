"use client";
import NavBar from "@/app/components/NavBar/navBar";
import Header from "@/app/components/Header/Header";
import React, { useContext, useEffect } from "react";
import ProfileCart from "@/app/components/chat/profile-cart";
import ConversationBar from "@/app/components/chat/conversation-bar/conversation-bar";
import {
  ChatSocket,
  ChatWebSocketContext,
  ChatWebsocketProvider,
} from "@/app/chat/context/chatWebsocketContext";
import { useGlobalUserContext } from "../context/UserDataContext";
import { event } from "@/app/chat/socket-event/socket-event";
import { GlobalMsgProvider } from "./context/lastMessageContext";
import { GlobalOnlineSocketContext } from "../context/online-status";
import { useOnlineStatusContext } from "../context/online-status-state";
import Wrapper from "../components/Wrapper/Wrapper";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <Wrapper>
      <Content>{children}</Content>
    </Wrapper>
  );
}


function Content({children}: {children: React.ReactNode}) {
  const { userData, UserLoading } = useGlobalUserContext();
  const onlineSocket = useContext(GlobalOnlineSocketContext);
  const socket = useContext(ChatWebSocketContext);
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

  useEffect(() => {
    if (userData.id !== "" && !socket.connected) {
      socket.connect();
      socket.on(event.CONNECT, () => {
        socket.emit(event.NEW_CONNECTION, userData.id);
      });
      socket.on(event.ERROR, (error) => {
        console.error("Socket connection error:", error);
      });
    }
    // add listener for new friend room to render the new room
    return () => {
      socket.off(event.CONNECT);
      socket.off(event.ERROR);
      socket.disconnect();
    };
  }, [userData.id, socket]);
  if (userData.id === "" ) {
    return <></>;
  }
  return (
  <>
    <ChatWebsocketProvider value={ChatSocket}>
      <main className="fixed flex h-screen w-screen flex-col-reverse md:flex-row">
        {/* main content */}
        <NavBar />
        <div className="flex h-full w-full flex-col gap-5 overflow-hidden px-5 pb-5">
          <Header />
          {/* content */}
          <GlobalMsgProvider>
            <div className="flex h-full w-full gap-5 overflow-hidden">
              {/* sidebar */}
              <div className="flex w-1/3 flex-col justify-between gap-5 ">
                {/* profile card */}
                <ProfileCart />
                {/* conversation card */}
                <ConversationBar />
              </div>
              {/* chat container */}
              {/* <Conversation /> */}
              {children}
            </div>
          </GlobalMsgProvider>
        </div>
      </main>
    </ChatWebsocketProvider>
  </>
  )
}