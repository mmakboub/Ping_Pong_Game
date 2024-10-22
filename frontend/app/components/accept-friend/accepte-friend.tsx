"use client";
import { GlobalWebSocketContext } from "@/app/context/GlobalSocket";
import { useGlobalUserContext } from "@/app/context/UserDataContext";
import { useGlobalRenderNotifContext } from "@/app/context/renderNotif";
import { FriendRequest } from "@/app/dtos/friendRequest.dto";
import notificationService from "@/app/profile/service/notification";
import React, { use, useContext } from "react";

interface AcceptButtonProps {
  sender: string;
}
function AcceptButton({ sender }: AcceptButtonProps) {
  const { userData } = useGlobalUserContext();
  const { renderNotif, setRenderNotif } = useGlobalRenderNotifContext();
  const globalsocket = useContext(GlobalWebSocketContext);
  const handleAccept = () => {
    notificationService
      .update<FriendRequest>("friend-accept/", {
        senderId: sender,
        receiverId: userData.username,
        id: "",
      })
      .then((res) => {
        setRenderNotif((prev) => !prev);
        if (res.data) {
          globalsocket.emit("friendRequestAccepted", {
            senderId: sender,
            receiverId: userData.id,
            roomId: res.data.id,
          });
        }
      });
  };
  return (
    <button
      className={`h-[30px] rounded-lg bg-onlineStatus  px-4 font-vietnam text-sm font-bold text-black hover:opacity-80`}
      onClick={handleAccept}
    >
      Accept
    </button>
  );
}
export default AcceptButton;
