import { ChatWebSocketContext } from "@/app/chat/context/chatWebsocketContext";
import chatService from "@/app/chat/services/chat-service";
import { useGlobalUserContext } from "@/app/context/UserDataContext";
import { Room } from "@/app/dtos/room.dto";
import { useContext, useState } from "react";
import { event } from "@/app/chat/socket-event/socket-event";
import JoinRoomPopup from "../../Popup/join-room-popup/joinRoomPopup";
import { RiUserForbidFill } from "react-icons/ri";
import { GiExitDoor } from "react-icons/gi";
interface NotMemberProps {
  room: Room;
  BeMember: boolean;
  setIsMember: React.Dispatch<React.SetStateAction<boolean>>;
  render: boolean;
}
function NotMember({ room, BeMember, setIsMember, render }: NotMemberProps) {
  const [JoinRoomButton, setJoinRoomButton] = useState(false);
  const [isBaned, setIsBaned] = useState(false);
  const { userData } = useGlobalUserContext();
  const chatSocket = useContext(ChatWebSocketContext);

  if (
    room.baned.some((member) => member.id === userData.id && isBaned === false)
  ) {
    setIsBaned(true);
  }
  const onJoinRoom = () => {
    if (room.type === "PUBLIC") {
      chatService
        .add("room/member", {
          roomId: room.id,
          roomType: room.type,
          password: "",
        })
        .then(() => {
          chatSocket.emit(event.JOIN_NEW_ROOM, {
            roomId: room.id,
            userId: userData.id,
            username: userData.username,
          });
          setIsMember(true);
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else if (room.type === "PROTECTED") {
      setJoinRoomButton(true);
    }
  };
  return !isBaned ? (
    <>
      {room.type === "PROTECTED" && (
        <JoinRoomPopup
          trigger={JoinRoomButton}
          setTrigger={setJoinRoomButton}
          roomId={room.id}
          setIsMember={setIsMember}
        />
      )}
      <div className="relative z-[1] flex w-2/3 flex-col justify-center gap-2 overflow-hidden rounded-xl bg-chatBackground">
        <div className="flex items-center justify-center text-[200px] text-white">
          <RiUserForbidFill className="mb-10" />
        </div>
        <p className=" mb-4 text-center text-[30px] font-bold text-primary">
          {"it seems you're not a member"}
        </p>
        <div className="mb-4 text-center text-white">
          {"Click the button below to join and start chatting with others"}
        </div>
        <button
          className="flex items-center  gap-3 self-center  p-2 text-[20px] text-white hover:border-b-2 hover:border-red-600 hover:text-red-600"
          onClick={onJoinRoom}
        >
          <p>Join now!</p>
          <GiExitDoor />
        </button>
      </div>
    </>
  ) : (
    <div className="relative z-[1] flex w-2/3 flex-col justify-center gap-2 overflow-hidden rounded-xl bg-chatBackground">
      <div className="flex items-center justify-center text-[200px] text-primary">
        <RiUserForbidFill className="mb-10" />
      </div>
      <p className=" mb-4 text-center text-[30px] font-bold text-primary">
        {"Oops! you're banned from this room"}
      </p>
    </div>
  );
}

export default NotMember;
