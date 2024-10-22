"use client";
import Image from "next/image";
import { useGlobalUserContext } from "@/app/context/UserDataContext";
import { ChatWebSocketContext } from "../../chat/context/chatWebsocketContext";
import { use, useContext, useEffect } from "react";
const ProfileCart = () => {
  const { userData } = useGlobalUserContext();
  return (
    <div
      className="h-auto w-full rounded-xl"
      style={{
        background:
          "linear-gradient(96deg, #3D3D3D 55.91%, rgba(56, 56, 56, 0.87) 85.5%)",
      }}
    >
      <div className="border-b border-hover px-4 py-3 font-vietnam text-xl font-bold text-white">
        Profile Info
      </div>
      <div className="flex flex-col items-center gap-4 px-4 py-4">
        <div className="flex gap-5 self-start">
          <div className="h-[60px] w-[60px]">
            <Image
              src={userData.pictureUrl}
              alt="Picture of the author"
              className="h-full w-full rounded-lg object-cover"
              width={100}
              height={100}
              priority
            />
          </div>
          <div className="font-vietnam text-[21px] font-bold text-white">
            {userData.firstname} {userData.lastname}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCart;
