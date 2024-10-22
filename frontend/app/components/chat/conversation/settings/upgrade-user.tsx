"use client";
import { useContext, useState } from "react";
import styles from "../conversation.module.css";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { User } from "@/app/dtos/user.dto";
import Image from "next/image";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { GiSoccerKick } from "react-icons/gi";
import { BsBanFill } from "react-icons/bs";
import { FaVolumeMute } from "react-icons/fa";
import { Room } from "@/app/dtos/room.dto";
import chatService from "@/app/chat/services/chat-service";
import { set } from "zod";
import { ChatWebSocketContext } from "@/app/chat/context/chatWebsocketContext";
import { useGlobalUserContext } from "@/app/context/UserDataContext";
interface UpgradeUserProps {
  trigger: boolean;
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  user: User;
  room: Room;
  isAdmin: boolean;
}
function UpgradeUser({
  trigger,
  setTrigger,
  user,
  room,
  isAdmin,
}: UpgradeUserProps) {
  const socket = useContext(ChatWebSocketContext);
  const [checkMute, setCheckMute] = useState(false);
  const { userData } = useGlobalUserContext();
  let time_to_mute = 0;
  const makeAdmin = (roomId: string, userId: string, username: string) => {
    socket.emit("make-admin", {
      roomId: roomId,
      userId: userId,
      by: userData.username,
      username: username,
    });
    setTrigger(false);
  };

  const removeAdmin = (roomId: string, userId: string) => {
    socket.emit("remove-admin", {
      roomId: roomId,
      userId: userId,
      by: userData.username,
      username: user.username,
    });
    setTrigger(false);
  };

  const kickMember = (roomId: string, userId: string) => {
    socket.emit("kick-member", {
      roomId: roomId,
      userId: userId,
      by: userData.username,
      username: user.username,
    });
    setTrigger(false);
  };
  const banMember = (roomId: string, userId: string) => {
    socket.emit("ban-member", {
      roomId: roomId,
      userId: userId,
      by: userData.username,
      username: user.username,
    });
    setTrigger(false);
  };
  const MuteMember = (roomId: string, userId: string) => {
    socket.emit("mute-member", {
      roomId: roomId,
      userId: userId,
      by: userData.username,
      username: user.username,
      period: time_to_mute.toString(),
      createat: new Date().getTime().toString(),
    });
  };
  return trigger && isAdmin ? (
    <div
      className={
        "fixed left-0 top-0 z-[40] flex h-full w-full items-center justify-center  "
      }
    >
      <div className="relative flex w-2/3 flex-col items-center justify-center gap-4 rounded-xl bg-[#1C1C1C] p-6 opacity-100 transition-opacity duration-300">
        <button
          className="absolute right-[10px] top-[10px]"
          onClick={() => setTrigger(false)}
        >
          <IoMdCloseCircleOutline
            className="text-primary hover:text-black "
            size={20}
          />
        </button>
        <div className="h-[60px] w-[60px]">
          <Image
            src={user.pictureUrl}
            alt="Picture of the author"
            className="h-full w-full rounded"
            width={100}
            height={100}
          />
        </div>
        <div className=" font-BeVietnamPro text-[14px] font-extrabold text-white ">
          {user.username}
        </div>
        {room.admin.some((admin) => user.id === admin.id) ? (
          <button
            className="flex w-full items-center justify-around rounded bg-[#323232] py-2  text-red-800 hover:bg-opacity-50"
            onClick={() => removeAdmin(room.id, user.id)}
          >
            <div className="font-BeVietnamPro font-bold ">remove admin</div>
            <MdOutlineAdminPanelSettings size={20} />
          </button>
        ) : (
          <button
            className="flex w-full items-center justify-around rounded bg-[#323232] py-2  text-green-600 hover:bg-opacity-50"
            onClick={() => makeAdmin(room.id, user.id, user.username)}
          >
            <div className="font-BeVietnamPro font-bold ">Set as admin</div>
            <MdOutlineAdminPanelSettings size={20} />
          </button>
        )}
        <button
          className="flex w-full items-center justify-around rounded bg-[#323232] py-2  text-[#F68C0F] hover:bg-opacity-50"
          onClick={() => kickMember(room.id, user.id)}
        >
          <div className="font-BeVietnamPro font-bold ">Kick this User</div>
          <GiSoccerKick size={20} />
        </button>
        <button
          className="flex w-full items-center justify-around rounded bg-[#323232] py-2 text-primary hover:bg-opacity-50"
          onClick={() => banMember(room.id, user.id)}
        >
          <div className="font-BeVietnamPro font-bold ">Ban this User</div>
          <BsBanFill size={20} />
        </button>
        <button
          className="text-[#674EFF flex w-full items-center justify-around rounded bg-[#323232] py-2 text-[#674EFF] hover:bg-opacity-50"
          onClick={() => setCheckMute(!checkMute)}
        >
          <div className="font-BeVietnamPro font-bold ">Mute this User</div>
          <FaVolumeMute size={20} />
        </button>
        {checkMute && (
          <div className="mt-2 grid w-full grid-cols-2 grid-rows-2 gap-3 font-BeVietnamPro font-bold">
            <button
              className="w-full rounded bg-hover py-1 text-[#78fe56] hover:bg-opacity-50"
              onClick={() => {
                time_to_mute = 1 * 60;
                MuteMember(room.id, user.id);
              }}
            >
              1 min
            </button>
            <button
              className="w-full rounded bg-hover py-1 text-[#e8ff3a] hover:bg-opacity-50"
              onClick={() => {
                time_to_mute = 5 * 60;
                MuteMember(room.id, user.id);
              }}
            >
              5 min
            </button>
            <button
              className="w-full rounded bg-hover py-1 text-[#efac47] hover:bg-opacity-50"
              onClick={() => {
                time_to_mute = 30 * 60;
                MuteMember(room.id, user.id);
              }}
            >
              30 min
            </button>
            <button
              className="w-full rounded bg-hover py-1 text-[#ff3c3c] hover:bg-opacity-50"
              onClick={() => {
                time_to_mute = 60 * 60;
                MuteMember(room.id, user.id);
              }}
            >
              60 min
            </button>
          </div>
        )}
      </div>
    </div>
  ) : (
    ""
  );
}

export default UpgradeUser;
