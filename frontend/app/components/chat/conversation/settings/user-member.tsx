"use client";
import React, { useState } from "react";
import UpgradeUser from "./upgrade-user";
import Image from "next/image";
import { User } from "@/app/dtos/user.dto";
import { Room } from "@/app/dtos/room.dto";
import { GiBossKey } from "react-icons/gi";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { useGlobalUserContext } from "@/app/context/UserDataContext";
interface UserMemberProps {
  member: User;
  room: Room;
  isAdmin: boolean;
}
const UserMember = ({ member, room, isAdmin }: UserMemberProps) => {
  const [uspgradeUser, setUpgradeUser] = useState(false);
  const { userData } = useGlobalUserContext();
  const handleClickMember = (member: User) => {
    if (member.id !== room.ownerId && member.id !== userData.id)
      setUpgradeUser(true);
  };
  return (
    <>
      <UpgradeUser
        trigger={uspgradeUser}
        setTrigger={setUpgradeUser}
        room={room}
        user={member}
        isAdmin={isAdmin}
      />
      <div
        className={`flex justify-between rounded bg-[#323232] p-3  ${member.id !== room.ownerId && isAdmin && member.id !== userData.id ? "hover:cursor-pointer hover:bg-opacity-60" : ""}`}
        onClick={() => handleClickMember(member)}
      >
        <div className="flex">
          <div className="h-[60px] w-[60px]">
            <Image
              src={member.pictureUrl}
              alt="Picture of the member"
              className="h-full w-full rounded-lg"
              width={100}
              height={100}
            />
          </div>
          <div className="ml-3 font-BeVietnamPro text-[20px] font-bold text-white">
            {member.username}
          </div>
        </div>
        {room.ownerId === member.id && (
          <div className=" flex  items-center gap-2 self-center text-[12px] text-white">
            <GiBossKey className="text-yellow-400" size={30} />
            <div className="text-yellow-400">Owner</div>
          </div>
        )}
        {room.admin.some((user) => user.id === member.id) &&
          room.ownerId !== member.id && (
            <div className=" flex items-center gap-2 self-center text-[12px] text-white">
              <MdOutlineAdminPanelSettings
                className="text-green-600"
                size={30}
              />
              <div className="text-green-600">Admin</div>
            </div>
          )}
      </div>
    </>
  );
};

export default UserMember;
