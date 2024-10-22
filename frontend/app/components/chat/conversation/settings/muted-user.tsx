"use client";
import { ChatWebSocketContext } from "@/app/chat/context/chatWebsocketContext";
import { mutedUsers } from "@/app/dtos/mutedUser";
import React, { useContext, useEffect, useState } from "react";

interface MutedTimerProps {
  mutedData: mutedUsers | null;
  setCheckMute: React.Dispatch<React.SetStateAction<boolean>>;
}
const MutedTimer = ({ mutedData, setCheckMute }: MutedTimerProps) => {
  const [minites, setMinites] = useState("");
  const [seconds, setSeconds] = useState("");
  const chatSocket = useContext(ChatWebSocketContext);
  const period = Number(mutedData?.period) / 60;
  useEffect(() => {
    const targetTime =
      Number(mutedData?.createat) + Number(mutedData?.period) * 1000;
    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      const diff = targetTime - currentTime;
      const min = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      if (min < 10) {
        setMinites("0" + min.toString());
      } else setMinites(min.toString());
      const sec = Math.floor((diff % (1000 * 60)) / 1000);
      if (sec < 10) {
        setSeconds("0" + sec.toString());
      } else setSeconds(sec.toString());
      if (diff <= 0) {
        if (mutedData?.roomId && mutedData?.userId)
          chatSocket.emit("unmute-member", {
            roomId: mutedData?.roomId,
            userId: mutedData?.userId,
          });
        setCheckMute(false);
        clearInterval(interval);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [mutedData, chatSocket, setCheckMute]);
  //   console.log("current time", currentTime);
  //   console.log("muted time", mutedData?.createat);
  if (!mutedData) return null;
  return (
    <div className="flex min-h-[100px] w-full flex-col items-center justify-center gap-1 bg-[#2B2B2B] px-10 pb-3">
      <h1 className=" font-BeVietnamPro text-sm font-bold text-white">
        You have been muted in this room for {minites}:{seconds}
      </h1>
      <p className="font-BeVietnamPro text-xs font-medium text-hover">
        {"an Admin muted you for " + period + " minutes"}
      </p>
    </div>
  );
};

export default MutedTimer;
