"use client";
import InputMsg from "./input-msg/Input-msg";
import ConversationContent from "./Contents/conversation-content";
import React, { use, useContext, useEffect, useRef, useState } from "react";
import { ChatWebSocketContext } from "../../../chat/context/chatWebsocketContext";
import chatService from "../../../chat/services/chat-service";
import { Msg } from "@/app/dtos/msg.dto";
import { Room } from "@/app/dtos/room.dto";
import { CanceledError } from "axios";
import UserConversationHeader from "./header/user-conversation-header";
import RoomConversationHeader from "./header/room-conversation-header";
import { useGlobalUserContext } from "@/app/context/UserDataContext";
import styles from "./conversation.module.css";
import { useGlobalMsgContext } from "../../../chat/context/lastMessageContext";
import { GiSleepingBag } from "react-icons/gi";
import { event } from "../../../chat/socket-event/socket-event";
import NotMember from "./not-member/not-member";
import ChatSetting from "./settings/settings";
import { User } from "@/app/dtos/user.dto";
import SendGameRequest from "../Game-invitation/send-invitation";
import { mutedUsers } from "@/app/dtos/mutedUser";
import MutedTimer from "./settings/muted-user";
import { WebsocketContext } from "@/app/game/mode/play/contexts/WebSocketContext";
import router, { useRouter } from "next/navigation";

interface ConversationProps {
  room: Room;
  ismember: boolean;
  setIsMember: React.Dispatch<React.SetStateAction<boolean>>;
  render: boolean;
  setRenderRoom: React.Dispatch<React.SetStateAction<boolean>>;
}
interface Blocker {
  block: User[];
  blockBy: User[];
}
const Conversation = ({
  room,
  ismember,
  setIsMember,
  render,
  setRenderRoom,
}: ConversationProps) => {
  const { setRender } = useGlobalMsgContext();
  const socket = useContext(ChatWebSocketContext);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkSetting, setCheckSetting] = useState(false);
  const { userData } = useGlobalUserContext();
  const [block, setBlock] = useState<User[]>([]);
  const [blockBy, setBlockBy] = useState<User[]>([]);
  const [checkMute, setCheckMute] = useState(false);
  const [mutedData, setMutedData] = useState<mutedUsers | null>(null);

  const gameSocket = useContext(WebsocketContext);
  useEffect(() => {
    gameSocket.connect();
    return () => {
      // gameSocket.disconnect();
    };
  }, [gameSocket]);
  useEffect(() => {
    const { request, cancel } = chatService.getOne<Blocker>(
      "block/",
      userData.id
    );
    request
      .then((res) => {
        setBlock(res.data.block);
        setBlockBy(res.data.blockBy);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
      });
    return () => {
      cancel();
    };
  }, [userData.id]);

  useEffect(() => {
    const { request, cancel } = chatService.getOne<mutedUsers>(
      "muted-users/",
      userData.id + "/" + room.id
    );
    request.then((res) => {
      if (res.data) {
        const targetTime =
          Number(res.data.createat) + Number(res.data.period) * 1000;
        const currentTime = new Date().getTime();
        if (targetTime > currentTime) {
          setCheckMute(true);
          setMutedData(res.data);
        } else
          socket.emit("unmute-member", {
            roomId: room.id,
            userId: userData.id,
          });
      }
    });
  }, [room, userData.id, socket]);
  useEffect(() => {
    socket.on(event.RECV_MESSAGE, (msg: Msg) => {
      // const userInfo = {
      //   username: userData.username,
      //   picture: userData.pictureUrl,
      // };
      // gameSocket.emit("join", userInfo);
      // console.log(msg);
      if (
        block.some((member) => member.id === msg.senderId) ||
        blockBy.some((member) => member.id === msg.senderId)
      )
        return;
      if (msg.roomId === room.id) {
        setMessages((prev) => [
          {
            senderId: msg.senderId,
            content: msg.content,
            time: msg.time,
            timeOnMilisecond: msg.timeOnMilisecond,
            roomId: msg.roomId,
            type: msg.type,
            senderPicture: msg.senderPicture,
          },
          ...prev,
        ]);
      }
    });
    return () => {
      socket.off(event.RECV_MESSAGE);
    };
  }, [block, blockBy, room, socket]);
  useEffect(() => {
    const { request, cancel } = chatService.getAllFor<Msg>(
      "room/msg/",
      room.id as string
    );
    request
      .then((res) => {
        setMessages(
          res.data.sort((a, b) => +b.timeOnMilisecond - +a.timeOnMilisecond)
        );
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });
    return () => {
      cancel();
    };
  }, [room]);

  const FriendOrRomm = room.type === "INDIVIDUAL" ? true : false;
  let Friendusername = "";
  if (FriendOrRomm) {
    userData.id === room.member[0].id
      ? (Friendusername = room.member[1].username)
      : (Friendusername = room.member[0].username);
  }
  useEffect(() => {
    socket.on("user-block-state", (data) => {
      console.log("data: ", data);
      if (data.roomId === room.id) {
        const member =
          userData.id === room.member[0].id ? room.member[1] : room.member[0];
        if (data.block) {
          if (data.friendId !== userData.id) {
            block.push(member);
            setBlock((prev) => [...prev, member]);
          } else {
            blockBy.push(member);
            setBlockBy((prev) => [...prev, member]);
          }
        } else {
          if (data.friendId !== userData.id) {
            const blockList = block.filter(
              (user) => user.username !== Friendusername
            );
            setBlock(blockList);
          } else {
            const blockByList = blockBy.filter(
              (user) => user.username !== Friendusername
            );
            setBlockBy(blockByList);
          }
        }
      }
    });
    return () => {
      socket.off("user-block-state");
    };
  });
  const handleDeblock = () => {
    socket.emit("deblock", {
      userId: userData.id,
      friendId:
        room.member[0].id === userData.id
          ? room.member[1].id
          : room.member[0].id,
      roomId: room.id,
    });
  };
  const SendMsg = (msgContent: string) => {
    if (messages.length === 0) setRender((prev) => !prev);
    setMessages([
      {
        senderId: userData.id,
        content: msgContent,
        time: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
        timeOnMilisecond: new Date().getTime().toString(),
        roomId: room.id,
        type: "TEXT",
        senderPicture: userData.pictureUrl,
      },
      ...messages,
    ]);
    socket.emit("sendMessage", {
      senderId: userData.id,
      content: msgContent,
      time: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      timeOnMilisecond: new Date().getTime().toString(),
      roomId: room.id,
      type: "TEXT",
      senderPicture: userData.pictureUrl,
    });
  };
  return ismember ? (
    <>
      <div className="relative z-[1] flex w-2/3 flex-col justify-between gap-2 overflow-hidden rounded-xl bg-[#2F2F2F]">
        {room.type !== "INDIVIDUAL" && (
          <ChatSetting
            setCheckSetting={setCheckSetting}
            checkSetting={checkSetting}
            room={room}
            setRenderRoom={setRenderRoom}
          />
        )}
        {messages.length != 0 && <div className={styles.snow}></div>}
        {/* chat header */}
        {FriendOrRomm ? (
          <UserConversationHeader
            handleDeleteClick={() => {
              setMessages([]);
            }}
            room={room}
            block={block}
            deblock={handleDeblock}
          />
        ) : (
          <RoomConversationHeader
            room={room}
            setCheckSetting={setCheckSetting}
            render={render}
          />
        )}
        {/* chat content */}
        {!loading && messages.length === 0 && (
          <div className="text-center font-BeVietnamPro text-[200px] font-extrabold text-white">
            <div className="flex items-center justify-center">
              <GiSleepingBag className="mb-10" />
            </div>
            <p className=" mb-4 text-[30px] font-bold text-primary">
              No messages yet
            </p>
            <div className="text-center text-[20px] text-white">
              <p className="p-2">
                {"Looks like you haven't intiated a conversation"}
              </p>
              <p className="p-2">{"with your friends"}</p>
            </div>
          </div>
        )}
        {room.type === "INDIVIDUAL" && (
          <SendGameRequest
            message={messages}
            setMessages={setMessages}
            roomId={room.id}
          />
        )}
        {!loading && messages.length !== 0 && (
          <ConversationContent
            messages={messages}
            block={block}
            blockBy={blockBy}
          />
        )}
        {/* chat input */}
        {FriendOrRomm &&
        block.some((member) => member.username === Friendusername) ? (
          <div className="flex min-h-[100px] w-full flex-col items-center justify-center gap-1 bg-[#2B2B2B] px-10 pb-3">
            <h1 className="font-BeVietnamPro text-sm font-bold text-white">
              You have blocked this account
            </h1>
            <p className="font-BeVietnamPro text-xs font-medium text-hover">
              {"You can't chat with " + Friendusername}
            </p>
            <button
              className="mt-2 rounded bg-hover px-6 py-1 font-BeVietnamPro text-sm font-bold text-white hover:bg-opacity-50 hover:text-primary"
              onClick={() => handleDeblock()}
            >
              Deblock
            </button>
          </div>
        ) : FriendOrRomm &&
          blockBy.some((member) => member.username === Friendusername) ? (
          <div className="flex min-h-[100px] w-full flex-col items-center justify-center gap-1 bg-[#2B2B2B] px-10 pb-3">
            <h1 className="font-BeVietnamPro text-sm font-bold text-white">
              You have been blocked by {Friendusername}
            </h1>
            <p className="font-BeVietnamPro text-xs font-medium text-hover">
              {"You can't chat with " + Friendusername}
            </p>
          </div>
        ) : checkMute ? (
          <MutedTimer mutedData={mutedData} setCheckMute={setCheckMute} />
        ) : (
          <InputMsg onSubmit={SendMsg} />
        )}
      </div>
    </>
  ) : (
    <NotMember
      room={room}
      BeMember={ismember}
      setIsMember={setIsMember}
      render={render}
    />
  );
};

export default Conversation;
