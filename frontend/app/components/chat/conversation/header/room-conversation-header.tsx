import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { Room } from "@/app/dtos/room.dto";
import { MdOutlineSettings } from "react-icons/md";
interface ConversationHeaderProps {
  setCheckSetting: React.Dispatch<React.SetStateAction<boolean>>;
  room: Room;
  render: boolean;
}

const RoomConversationHeader = ({
  setCheckSetting,
  room,
  render,
}: ConversationHeaderProps) => {
  const roomMembers = room.member.map((user) => user.username).join(", ");
  return (
    <>
      <div className="flex h-20 items-center justify-between border-b border-hr bg-background p-3">
        <div className="flex gap-4">
          <Image
            src={room.pictureUrl}
            alt="Picture of the author"
            className="h-12 w-12 rounded"
            width={48}
            height={48}
          />
          <div className="font-vietnam text-white">
            <h3 className="mb-1 text-[15px] font-normal">{room.name}</h3>
            <h6 className="testt text-[10px] text-fill">{roomMembers}</h6>
          </div>
        </div>
        <button
          className="mr-3 h-10 w-10 rounded text-center text-white duration-100 hover:cursor-pointer hover:bg-hr hover:text-primary"
          onClick={() => setCheckSetting(true)}
        >
          <MdOutlineSettings size={30} className="mx-auto" />
        </button>
      </div>
    </>
  );
};

export default RoomConversationHeader;
