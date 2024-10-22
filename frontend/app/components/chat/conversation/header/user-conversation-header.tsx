import React, { use, useContext, useEffect, useState } from "react";
import Image from "next/image";
import { IoMdMore } from "react-icons/io";
import { MdBlock } from "react-icons/md";
import { Room } from "@/app/dtos/room.dto";
import { useGlobalUserContext } from "@/app/context/UserDataContext";
import styles from "./conversation.module.css";
import { ChatWebSocketContext } from "@/app/chat/context/chatWebsocketContext";
import { User } from "@/app/dtos/user.dto";
import { CgProfile } from "react-icons/cg";
import { ImUndo2 } from "react-icons/im";
import { useRouter } from "next/navigation";
import { WebsocketContext } from "@/app/game/mode/play/contexts/WebSocketContext";
import OnlineStatus from "../../../online-status/online-status";
import { OnlineStateProvider } from "@/app/context/online-status-state";
interface ConversationHeaderProps {
  handleDeleteClick: () => void;
  room: Room;
  block: User[];
  deblock: () => void;
}

const UserConversationHeader = ({
  room,
  block,
  deblock,
}: ConversationHeaderProps) => {
  const [moreButton, setmoreButton] = useState(false);
  const { userData } = useGlobalUserContext();
  const socket = useContext(ChatWebSocketContext);
  const router = useRouter();
  let friendId =
    userData.id === room.member[0].id ? room.member[1].id : room.member[0].id;
  const handleBlock = () => {
    socket.emit("block", {
      userId: userData.id,
      friendId: friendId,
      roomId: room.id,
    });
  };
  const gameSocket = useContext(WebsocketContext);

  useEffect(() => {
    return () => {
      gameSocket.emit("cancelPrivate", {
        roomID: room.id,
        // playerNo: props.localPlayerNo,
        playerUsername: userData.username,
      });
    };
  }, [gameSocket, room.id, userData.username]);

  useEffect(() => {
    let handler = () => {
      setmoreButton(false);
    };
    document.addEventListener("mousedown", handler);
  });
  const handleClickMore = () => {
    setmoreButton(!moreButton);
  };
  let friendname = "";
  let friendPicture = "";
  if (room.member[0].username === userData.username) {
    friendname = room.member[1].username;
    friendPicture = room.member[1].pictureUrl;
  } else {
    friendname = room.member[0].username;
    friendPicture = room.member[0].pictureUrl;
  }

  return (
    <>
      <div
        className={`absolute right-2 top-[80px] h-auto w-[180px] rounded-2xl bg-hr ${moreButton ? styles.active : styles.inactive}
                before:absolute before:right-[20px] before:top-[-5px] before:h-[20px] before:w-[20px] before:rotate-45 before:bg-hr`}
      >
        {!block.some((user) => user.id === friendId) ? (
          <button
            className="flex h-1/2 w-full items-center gap-3 p-4 text-[15px] font-bold text-white duration-100
                    hover:rounded-b-2xl hover:text-primary"
            onClick={() => handleBlock()}
          >
            <MdBlock className="h-4 w-4" />
            <span>Block</span>
          </button>
        ) : (
          <button
            className="flex h-1/2 w-full items-center gap-3 p-4 text-[15px] font-bold text-white duration-100
          hover:rounded-b-2xl hover:text-primary"
            onClick={deblock}
          >
            <ImUndo2 className="h-4 w-4" />
            <span>Deblock</span>
          </button>
        )}
        <button
          className="flex h-1/2 w-full items-center gap-3 p-4 text-[15px] font-bold text-white duration-100
                    hover:rounded-b-2xl hover:text-primary"
          onClick={() => {
            router.push(`/profile/${friendname}`);
          }}
        >
          <CgProfile className="h-4 w-4" />
          <span>visite Profile</span>
        </button>
      </div>
      <div className="flex h-20 justify-between border-b border-hr bg-background p-3">
        <div className="flex gap-4">
          <Image
            src={friendPicture}
            alt="Picture of the author"
            className="h-12 w-12 rounded"
            width={48}
            height={48}
          />
          <div className="font-vietnam text-white">
            <h3 className="mb-1 text-[15px] font-normal">{friendname}</h3>
            <OnlineStatus state={2} userId={friendId} />
          </div>
        </div>
        <button
          className="h-14 w-10 rounded duration-100  hover:cursor-pointer hover:bg-hr"
          onClick={handleClickMore}
        >
          <IoMdMore className="h-full w-full text-white" />
        </button>
      </div>
    </>
  );
};

export default UserConversationHeader;
