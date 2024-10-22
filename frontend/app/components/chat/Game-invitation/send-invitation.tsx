import { ChatWebSocketContext } from "@/app/chat/context/chatWebsocketContext";
import { useGlobalUserContext } from "@/app/context/UserDataContext";
import { Msg } from "@/app/dtos/msg.dto";
import { WebsocketContext } from "@/app/game/mode/play/contexts/WebSocketContext";
import { useContext, useEffect, useState } from "react";
import { IoGameController } from "react-icons/io5";
import { RiPingPongLine } from "react-icons/ri";

interface SendGameRequestProps {
    message: Msg[];
    setMessages: React.Dispatch<React.SetStateAction<Msg[]>>;
    roomId: string;
  }
  function SendGameRequest({
    message,
    setMessages,
    roomId,
  }: SendGameRequestProps) {
    const [toggle, setToggle] = useState(false);
    const { userData } = useGlobalUserContext();
    const socket = useContext(ChatWebSocketContext);
    const gameSocket = useContext(WebsocketContext);

 
    const handleSendGameRequest = () => {
      const userInfo = {
        username: userData.username,
        picture: userData.pictureUrl,
        roomId: roomId,
        type: "owner",
      }
      gameSocket.emit('joinInvit', userInfo);
      setMessages([
        {
          senderId: userData.id,
          content: "I want to play game with you",
          time: new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
          timeOnMilisecond: new Date().getTime().toString(),
          roomId: "1",
          type: "INVITE_GAME",
          senderPicture: userData.pictureUrl,
        },
        ...message,
      ]);
      socket.emit("sendMessage", {
        senderId: userData.id,
        content: "I want to play game with you",
        time: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
        timeOnMilisecond: new Date().getTime().toString(),
        roomId: roomId,
        type: "INVITE_GAME",
        senderPicture: userData.pictureUrl,
      });
    };
    return (
      <div className="absolute top-[100px]">
        <button
          id="dropdownHoverButton"
          className="ml-3 rounded-full bg-[#282828] p-2 text-center text-primary transition duration-300 hover:bg-opacity-0 hover:text-primary hover:shadow-xl hover:shadow-[#242424]"
          type="button"
          onClick={() => setToggle(!toggle)}
        >
          <IoGameController size={35} />
        </button>
  
        <div
          className={`text-md ml-10 mt-2  ${toggle ? "flex" : "hidden "}  h-10 w-44 items-center justify-center rounded-b-lg rounded-tr-lg border-2 border-primary bg-[#222222]  font-bold text-white shadow hover:bg-opacity-40 `}
        >
          <button
            className="text-md flex w-full items-center justify-center gap-6 font-bold text-fill"
            onClick={() => {
              handleSendGameRequest();
              // setToggle(false);
            }}
          >
            {"Let's play"}
            <RiPingPongLine size={20} />
          </button>
        </div>
      </div>
    );
  }

export default SendGameRequest;