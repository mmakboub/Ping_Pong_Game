"use client";
import { notFound, useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import chatService from "@/app/chat/services/chat-service";
import { Room } from "@/app/dtos/room.dto";
import { CanceledError } from "axios";
import { ParsedUrlQuery } from "querystring";
import Conversation from "../../../components/chat/conversation/conversation";
import { useGlobalUserContext } from "@/app/context/UserDataContext";
import { ChatWebSocketContext } from "../../context/chatWebsocketContext";

const Page = ({ params }: { params: ParsedUrlQuery }) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ismember, setIsMember] = useState(false);
  const [render, setRender] = useState(false);
  const { userData } = useGlobalUserContext();
  const socket = useContext(ChatWebSocketContext);

  useEffect(() => {
    socket.on("update-room", (data) => {
      if (data.roomId === room?.id) {
        setRender((prev) => !prev);
      }
    });
    return () => {
      socket.off("update-room");
    };
  });
  useEffect(() => {
    const { request, cancel } = chatService.getOne<Room>(
      "room/",
      params.roomid as string
    );
    request
      .then((res) => {
        setRoom(res.data);
        if (res.data.member.some((member) => member.id === userData.id)) {
          setIsMember(true);
        } else setIsMember(false);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });
    return () => {
      cancel();
    };
  }, [params, userData, render]);
  // if (loading) return <h1>room loading...</h1>;
  if (!room && !loading) return notFound();
  return (
    <>
      {/* <div>Room: {room.name}</div> */}
      {error && <div>room not found</div>}
      {room && (
        <Conversation
          room={room}
          ismember={ismember}
          setIsMember={setIsMember}
          render={render}
          setRenderRoom={setRender}
        />
      )}
    </>
  );
};

export default Page;
