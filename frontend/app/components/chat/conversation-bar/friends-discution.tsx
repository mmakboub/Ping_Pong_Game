"use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { useGlobalUserContext } from "@/app/context/UserDataContext";
import { Room } from "@/app/dtos/room.dto";
import chatService from "@/app/chat/services/chat-service";
import { CanceledError } from "axios";
import { useGlobalMsgContext } from "@/app/chat/context/lastMessageContext";
import { ChatWebSocketContext } from "@/app/chat/context/chatWebsocketContext";
import { GlobalWebSocketContext } from "@/app/context/GlobalSocket";
import { event } from "@/app/chat/socket-event/socket-event";
import { useRouter } from "next/navigation";
import Discutions from "./discutions";
import OnlineStatus from "../../online-status/online-status";
import { OnlineStateProvider } from "@/app/context/online-status-state";
const Friends = () => {
  const { render, setRender } = useGlobalMsgContext();
  const [friends_rooms, setFriends_rooms] = useState<Room[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { userData } = useGlobalUserContext();
  const chatSocket = useContext(ChatWebSocketContext);
  const globalsocket = useContext(GlobalWebSocketContext);
  const router = useRouter();
  // remove this to chat bar
  useEffect(() => {
    globalsocket.on("newFriendRoom", (roomId) => {
      setRender((prev) => !prev);
      chatSocket.emit(event.JOIN_FRIEND_ROOM, {
        roomId: roomId,
        userId: userData.id,
      });
    });
    return () => {
      globalsocket.off("newFriendRoom");
    };
  }, [chatSocket, setRender, globalsocket, userData]);

  useEffect(() => {
    const { request, cancel } = chatService.getAll<Room>("f-rooms/");
    request
      .then((res) => {
        setFriends_rooms(res.data);
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
  }, [render]);
  return (
    <>
      <div className=" flex h-full flex-col rounded-b-xl p-2">
        {/* title */}
        <div className="mt-1 flex justify-between gap-4">
          <div className="font-vietnam text-xl font-bold text-white">
            Friends
          </div>
        </div>
        <div className="flex min-h-[110px] w-full gap-3 overflow-x-auto border-b border-hr py-3">
          {friends_rooms &&
            friends_rooms.map((room, index) => (
              <div
                onClick={() => router.push(`/chat/rooms/${room.id}`)}
                key={index}
                className="itmes-center flex w-auto min-w-max flex-col justify-center rounded-xl p-1 hover:cursor-pointer hover:bg-hr"
              >
                <div className="relative mb-2 h-[50px] w-[50px] self-center">
                  <OnlineStatus
                    state={1}
                    userId={
                      room.member[0].id === userData.id
                        ? room.member[1].id
                        : room.member[0].id
                    }
                  />
                  <Image
                    src={
                      room.member[0].id === userData.id
                        ? room.member[1].pictureUrl
                        : room.member[0].pictureUrl
                    }
                    alt="room picture"
                    className="h-full w-full rounded-full object-cover"
                    width={100}
                    height={100}
                  />
                </div>
                <h3 className="self-center text-xs text-white ">
                  {room.member[0].id === userData.id
                    ? room.member[1].username
                    : room.member[0].username}
                </h3>
              </div>
            ))}
        </div>
        <h1 className="border-b border-hr py-4 font-vietnam text-xl font-bold text-white">
          Discussions
        </h1>
        {friends_rooms && <Discutions rooms={friends_rooms} check={true} />}
      </div>
    </>
  );
};

export default Friends;
