"use client";
import { BsChatTextFill } from "react-icons/bs";
import RoomPopup from "../components/chat/Popup/create-room-popup/create-room-popup";
import { useState } from "react";
import Wrapper from "../components/Wrapper/Wrapper";
export default function Chat() {
  const [addRoomButton, setButtonPopup] = useState(false);
  return (
      <div className="relative z-[1] flex w-2/3 flex-col items-center justify-evenly gap-2 overflow-hidden rounded-xl bg-[#2F2F2F]">
        {/* chat header */}
        <RoomPopup trigger={addRoomButton} setTrigger={setButtonPopup} />
        <div className="text-center font-BeVietnamPro text-[200px] font-extrabold text-primary">
          <div className="flex items-center justify-center">
            <BsChatTextFill className="mb-10" />
          </div>
          <p className=" mb-4 text-[30px] font-bold text-white">
            Select a conversation or start
          </p>
          <div className="text-center text-[20px] text-primary">
            <button
              className="p-2 hover:border-b-2"
              onClick={() => setButtonPopup(true)}
            >
              a new one
            </button>
          </div>
        </div>
        <div></div>
      </div>
  );
}
