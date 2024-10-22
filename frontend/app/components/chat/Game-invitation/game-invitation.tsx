"use client";
import { useGlobalUserContext } from "@/app/context/UserDataContext";
import { Msg } from "@/app/dtos/msg.dto";
import { WebsocketContext } from "@/app/game/mode/play/contexts/WebSocketContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { TbPingPong } from "react-icons/tb";
interface GameInviteProps {
  msg: Msg;
}

function GameInvite({ msg }: GameInviteProps) {
  // console.log(msg);
  const { userData } = useGlobalUserContext();
  const [time, setTime] = useState(new Date().getTime().toString());
  const gameSocket = useContext(WebsocketContext);

  const router = useRouter();

  // const roomId = useRef(0);
  // const localPlayerNo = useRef(0);
  const roomId = useRef(0);
  const [localPlayerNo, setLocalPlayerNo] = useState(0);

  const handleAcceptClick = () => {
    let id: number = roomId.current;

    const userInfo = {
      username: userData.username,
      picture: userData.pictureUrl,
      roomId: msg.roomId,
      type: "guest",
    };
    gameSocket.emit("joinInvit", userInfo);

  };

  useEffect(() => {
    // console.log(msg);
		gameSocket.on("roomId", (room) => {
			roomId.current = room.id;
		});
    gameSocket.on("playerInfoAndRoomId", (obj: any) => {
      // roomId.current = obj.roomId;

      roomId.current = obj.roomId;
      setLocalPlayerNo(obj.playerInfo.playerNo);
    });

    gameSocket.on("bothAccepted", (receivedRoomId) => {
      console.log("current from bothAcc", roomId.current);
      console.log("receivedRoomId from bothAcc", receivedRoomId);
      if (receivedRoomId == roomId.current) {
        router.push("/game/mode/play");
      }
    });

    return () => {
      gameSocket.off("playerInfoAndRoomId");
      gameSocket.off("bothAccepted");
      gameSocket.off('roomId');
    };
  }, [gameSocket, localPlayerNo, router]);
  return msg.senderId === userData.id ? (
    <>
      <div className="items-cente flex gap-4">
        <div
          className={`max-h-min w-auto self-end rounded-full ${msg.senderId === userData.id ? "order-2" : "order-0"}`}
        >
          <Image
            src={msg.senderPicture}
            width={30}
            height={30}
            alt="sender"
            className="rounded-full"
            priority
            quality={100}
          />
        </div>
        <div
          className={`flex h-auto min-h-11 max-w-[300px] flex-col items-end   break-all rounded-t-2xl ${msg.senderId === userData.id ? "rounded-bl-2xl border-r-2" : "rounded-br-2xl border-l-2 border-white"} bg-[#1f1f1f]
                 px-3 py-2 font-vietnam text-[14px] font-bold text-white`}
        >
          {"Game on! are you ready for a round of ping pong?"}
          <div className="flex w-full justify-end ">
            <TbPingPong size={30} className="self-end text-white" />
          </div>
        </div>
      </div>
      <div
        className={`font-vietnam text-[10px] font-bold text-msgcolor ${msg.senderId === userData.id ? "self-end" : ""} `}
      >
        {msg.time}
      </div>
    </>
  ) : (
    <>
      <div className="items-cente flex gap-4">
        <div
          className={`max-h-min w-auto self-end rounded-full ${msg.senderId === userData.id ? "order-2" : "order-0"}`}
        >
          <Image
            src={msg.senderPicture}
            width={30}
            height={30}
            alt="sender"
            className="rounded-full"
            priority
            quality={100}
          />
        </div>
        <div
          className={`flex h-auto min-h-11 max-w-[300px] flex-col items-end gap-4  break-all rounded-t-2xl ${msg.senderId === userData.id ? "rounded-bl-2xl border-r-2" : "rounded-br-2xl border-l-2 border-primary"} bg-[#1f1f1f]
                 px-3 py-2 font-vietnam text-[14px] font-bold text-white`}
        >
          {"Let's play! Click to challenge me"}
          <div className="flex w-full justify-between gap-20">
            <button
              className="text-md rounded bg-[#505050] px-6 py-1 font-BeVietnamPro font-extrabold text-white hover:bg-opacity-40"
              onClick={handleAcceptClick}
            >
              Accept
            </button>
            <TbPingPong size={30} className="self-end text-white" />
          </div>
        </div>
      </div>
      <div
        className={`font-vietnam text-[10px] font-bold text-msgcolor ${msg.senderId === userData.id ? "self-end" : ""} `}
      >
        {msg.time}
      </div>
    </>
  );
}

export default GameInvite;
