"use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { Room } from "@/app/dtos/room.dto";
import chatService from "@/app/chat/services/chat-service";
import { CanceledError } from "axios";
import { MdAddCircleOutline } from "react-icons/md";
import Discutions from "./discutions";
import Link from "next/link";
import RoomPopup from "../Popup/create-room-popup/create-room-popup";
import { ChatWebSocketContext } from "@/app/chat/context/chatWebsocketContext";
import { event } from "@/app/chat/socket-event/socket-event";
import { useGlobalMsgContext } from "@/app/chat/context/lastMessageContext";
import { useRouter } from "next/navigation";
const Rooms = () => {
  const { render } = useGlobalMsgContext();
  const [rooms, setRooms] = useState<Room[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const socket = useContext(ChatWebSocketContext);
  const router = useRouter();
  const [newRoom, setNewRoom] = useState<boolean>(false);
  const [addRoomButton, setButtonPopup] = useState(false);
  useEffect(() => {
    socket.on(event.NEW_ROOM, () => {
      setNewRoom(!newRoom);
    });
    return () => {
      socket.off(event.NEW_ROOM);
    };
  });
  useEffect(() => {
    // you should get all the rooms for this user without the individual rooms
    const { request, cancel } = chatService.getAll<Room>("all-rooms/");
    request
      .then((res) => {
        setRooms(res.data);
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
  }, [newRoom, render]);
  return (
    <>
      <div className=" flex h-full flex-col  overflow-y-auto rounded-b-xl p-2">
        {/* title */}
        <RoomPopup trigger={addRoomButton} setTrigger={setButtonPopup} />
        <div className="mt-1 flex justify-between gap-4">
          <div className="self-center font-vietnam text-xl font-bold text-white">
            Rooms
          </div>
          <button
            className="flex h-auto w-[100px] justify-center gap-2 rounded bg-primary p-2 text-white hover:bg-white hover:text-primary"
            onClick={() => setButtonPopup(true)}
          >
            <div className="text-l font-vietnam font-normal">create</div>
            <MdAddCircleOutline className="h-5 w-5 self-center font-bold" />
          </button>
        </div>
        <div className="flex min-h-[110px] w-full gap-3 overflow-x-auto border-b border-hr py-3 ">
          {rooms &&
            rooms.map((room, index) => (
              <div
                onClick={() => router.push(`/chat/rooms/${room.id}`)}
                key={index}
                className="itmes-center flex w-auto min-w-max flex-col justify-center rounded-xl p-1 hover:cursor-pointer hover:bg-hr"
              >
                <div className="mb-2 h-[50px] w-[50px] self-center">
                  <Image
                    src={room.pictureUrl}
                    alt="room picture"
                    className="h-full w-full rounded-full object-cover"
                    width={100}
                    height={100}
                  />
                </div>
                <h3 className="self-center text-xs text-white ">{room.name}</h3>
              </div>
            ))}
        </div>
        <h1 className="border-b border-hr py-4 font-vietnam text-xl font-bold text-white">
          Discussions
        </h1>
        {rooms && <Discutions rooms={rooms} check={false} />}
      </div>
    </>
  );
};

export default Rooms;
