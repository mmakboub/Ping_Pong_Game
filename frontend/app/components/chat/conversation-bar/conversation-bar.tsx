"use client";
import React, { useEffect, useState } from "react";
import ConversationButton from "@/app/components/chat/conversation-bar/conversation-bar-button";
import Friends from "./friends-discution";
import Rooms from "./rooms-discution";
import { ChatWebSocketContext } from "../../../chat/context/chatWebsocketContext";
import Searchbar from "./searchbar";

const ConversationBar = () => {
  const [roomToggel, setRoomToggel] = useState(true);

  const handleClickRooms = () => {
    setRoomToggel(false);
  };
  const handleClickFriend = () => {
    setRoomToggel(true);
  };
  return (
    <>
      <Searchbar />
      <div
        className="flex h-4/5 w-full  flex-col justify-between overflow-hidden rounded-xl"
        style={{
          background:
            "linear-gradient(96deg, #3D3D3D 55.91%, rgba(56, 56, 56, 0.87) 85.5%)",
        }}
      >
        {/* search bar */}
        {/* conversation Buttons */}
        <div className="flex h-[75px] overflow-hidden rounded-t-xl">
          <ConversationButton
            handleClick={handleClickFriend}
            state={roomToggel}
          >
            Friends
          </ConversationButton>
          <ConversationButton
            handleClick={handleClickRooms}
            state={!roomToggel}
          >
            Rooms
          </ConversationButton>
        </div>
        {roomToggel && <Friends />}
        {!roomToggel && <Rooms />}
      </div>
    </>
  );
};

export default ConversationBar;
