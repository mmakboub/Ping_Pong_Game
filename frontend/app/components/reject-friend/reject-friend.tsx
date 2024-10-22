import React, { useContext } from "react";
import notificationService from "@/app/profile/service/notification";
import { FriendRequest } from "@/app/dtos/friendRequest.dto";
import { useGlobalUserContext } from "@/app/context/UserDataContext";
import { useGlobalRenderNotifContext } from "@/app/context/renderNotif";
import { GlobalWebSocketContext } from "@/app/context/GlobalSocket";
interface RejectFriendProps {
  sender: string;
}
const RejectFriend = ({ sender }: RejectFriendProps) => {
  const { userData } = useGlobalUserContext();
  const { renderNotif, setRenderNotif } = useGlobalRenderNotifContext();
  const globalsocket = useContext(GlobalWebSocketContext);
  const RejectFriend = () => {
    notificationService
      .update<FriendRequest>("friend-reject/", {
        senderId: sender,
        receiverId: userData.username,
        id: "",
      })
      .then((res) => {
        setRenderNotif((prev) => !prev);
      });
  };
  return (
    <button
      className="h-[30px] items-center rounded-lg bg-primary px-4 font-vietnam text-sm  font-bold text-black hover:opacity-80"
      onClick={RejectFriend}
    >
      Decline
    </button>
  );
};

export default RejectFriend;
