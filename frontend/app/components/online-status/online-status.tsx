"use client";
import { useOnlineStatusContext } from "@/app/context/online-status-state";
import { FaGamepad } from "react-icons/fa";
interface OnlineStatusProps {
  state: number;
  userId: string;
}
function OnlineStatus({ state, userId }: OnlineStatusProps) {
  const { status } = useOnlineStatusContext();

  let onlineState = "";
  const user = status.find((s) => s.userId === userId);
  if (user) {
    onlineState = user.status;
  } else {
    onlineState = "offline";
  }

  if (state === 1) {
    if (onlineState === "online") {
      return (
        <div className="absolute bottom-[-2px] right-[-2px] h-3 w-3 rounded-full border border-background bg-onlineStatus"></div>
      );
    } else if (onlineState === "in-game") {
      return (
        <div className=" absolute bottom-[-2px] right-[-2px] h-4 w-4 rounded-full font-bold text-[#000000]">
          <FaGamepad className="h-full w-full rounded-full bg-orange-500 p-[1px]" />
        </div>
      );
    }
    return (
      <div className="absolute bottom-[-2px] right-[-2px] h-3 w-3 rounded-full border border-background bg-fill"></div>
    );
  } else if (state === 2) {
    if (onlineState === "online") {
      return (
        <div className="text-[10px] font-bold text-onlineStatus">online</div>
      );
    } else if (onlineState === "in-game") {
      return (
        <div className="text-[10px] font-bold text-orange-500">in-game</div>
      );
    }
    return <div className="text-[10px] font-bold text-fill">offline</div>;
  }
}
export default OnlineStatus;
