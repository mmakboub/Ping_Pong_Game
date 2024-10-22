"use client";
import Image from "next/image";
import { Room } from "@/app/dtos/room.dto";
import { useGlobalUserContext } from "@/app/context/UserDataContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { event } from "@/app/chat/socket-event/socket-event";
import { ChatWebSocketContext } from "@/app/chat/context/chatWebsocketContext";
import { Msg } from "@/app/dtos/msg.dto";
import OnlineStatus from "../../online-status/online-status";
import { OnlineStateProvider } from "@/app/context/online-status-state";
interface Props {
  check: boolean;
  RoomItem: Room;
}
const DiscutionField = ({ check, RoomItem }: Props) => {
  const { userData } = useGlobalUserContext();
  const router = useRouter();
  const [lastMsg, setLastMsg] = useState<Msg | null>(null);
  const chatSocket = useContext(ChatWebSocketContext);
  const userId = userData.id;
  useEffect(() => {
    if (RoomItem.msgs.length !== 0)
      setLastMsg(
        (prev) =>
          RoomItem.msgs.sort(
            (a, b) => +b.timeOnMilisecond - +a.timeOnMilisecond
          )[0]
      );
    chatSocket.on(event.LAST_MESSAGE, (msg: Msg) => {
      if (msg.roomId === RoomItem.id) setLastMsg((prev) => msg);
    });

    return () => {
      chatSocket.off(event.LAST_MESSAGE);
    };
  }, [chatSocket, RoomItem]);
  const userPic =
    RoomItem.type === "INDIVIDUAL" && RoomItem.member[0].id === userId
      ? RoomItem.member[1].pictureUrl
      : RoomItem.member[0].pictureUrl;
  let roomPicture =
    RoomItem.type === "INDIVIDUAL" ? userPic : RoomItem.pictureUrl;
  if (!lastMsg) return <></>;
  return (
    <div onClick={() => router.push(`/chat/rooms/${RoomItem.id}`)}>
      <div className="my-2 flex justify-between rounded-xl p-2 hover:cursor-pointer hover:bg-hr">
        <div className="flex justify-between gap-2">
          <div className="relative h-14 w-14">
            {RoomItem.type === "INDIVIDUAL" && (
                <OnlineStatus
                  state={1}
                  userId={
                    RoomItem.member[0].id === userId
                      ? RoomItem.member[1].id
                      : RoomItem.member[0].id
                  }
                />
            )}
            <Image
              src={roomPicture}
              alt="Picture of the author"
              className="h-full w-full rounded"
              width={40}
              height={40}
            />
          </div>

          <div className="flex flex-col justify-around font-vietnam text-white">
            <h3 className="mb-1 text-[15px] font-normal text-white">
              {!check
                ? RoomItem.name
                : RoomItem.member[0].id === userId
                  ? RoomItem.member[1].username
                  : RoomItem.member[0].username}
            </h3>
            <h6 className="max-h-[15px] max-w-[100px] overflow-hidden text-ellipsis text-[10px] text-fill">
              {/* last message content */}
              {lastMsg.content}
              {/* {room.msgs[0].content} */}
            </h6>
          </div>
        </div>
        <div className="flex flex-col justify-around">
          <div className="font-vietnam text-9 font-bold text-msgcolor">
            {/* last message time */}
            {lastMsg.time}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscutionField;
