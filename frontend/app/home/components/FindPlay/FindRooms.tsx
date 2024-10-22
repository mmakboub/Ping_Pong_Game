"use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { Room } from "@/app/dtos/room.dto";
import chatService from "@/app/chat/services/chat-service";
import { CanceledError } from "axios";
import { ChatWebSocketContext } from "@/app/chat/context/chatWebsocketContext";
import { event } from "@/app/chat/socket-event/socket-event";
import { useGlobalMsgContext } from "@/app/chat/context/lastMessageContext";
import { useRouter } from "next/navigation";
import { GiBossKey } from "react-icons/gi";
const FindRooms = () => {
  const { render } = useGlobalMsgContext();
  const [rooms, setRooms] = useState<Room[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const socket = useContext(ChatWebSocketContext);
  const router = useRouter();
  const [newRoom, setNewRoom] = useState<boolean>(false);
  useEffect(() => {
    socket.on(event.NEW_ROOM, () => {
      setNewRoom(!newRoom);
    });
    return () => {
      socket.off(event.NEW_ROOM);
    };
  });
  useEffect(() => {
    const { request, cancel } = chatService.getAll<Room>("PP-rooms/");
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
      <div className=" flex h-[60%] flex-col  overflow-y-auto rounded-xl bg-[#2F2F2F]  p-2">
        {/* title */}

        <div className="mt-1 flex h-[7%] justify-between gap-4 border-b  border-[white]  hover:text-primary">
          <div className="ml-3  self-center font-vietnam text-xl font-bold text-white">
            Rooms
          </div>
        </div>
        <div className="flex h-[92%] w-full flex-col gap-3 overflow-y-auto border-b border-hr py-3 ">
          {rooms &&
            rooms.map((room, index) => (
              <div
                key={index}
                className=" flex w-auto min-w-max flex-row justify-between rounded-xl p-1 "
              >
                <div className=" flex flex-row gap-2 ">
                  <div className="relative mb-2 w-[50px] self-center">
                    {/* <div className="absolute bottom-0 right-[5%] h-3 w-3 rounded-full border-2 border-background bg-onlineStatus"></div> */}
                    <Image
                      src={room.pictureUrl}
                      alt="room picture"
                      className="h-12 w-12 rounded-full"
                      width={50}
                      height={50}
                    />
                  </div>
                  <div className="text-s mb-2 flex h-full  flex-col justify-start self-center font-vietnam  text-white ">
                    <h3 className="text-s flex h-full w-full justify-start self-center text-white ">
                      {room.name}
                    </h3>
                    <div className=" text-s flex h-full  flex-row justify-start font-vietnam   ">
                      <GiBossKey className="text-yellow-400" size={20} />
                      {room.owner && (
                        <h3 className=" h-full text-xs   text-[#807f7f]">
                          {room.owner.username}
                        </h3>
                      )}{" "}
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    className="flex h-auto w-[100px] justify-center gap-2 rounded bg-primary p-2 text-white hover:bg-white hover:text-primary"
                    onClick={() => router.push(`/chat/rooms/${room.id}`)}
                  >
                    <div className="text-l font-vietnam font-normal ">Join</div>
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default FindRooms;
