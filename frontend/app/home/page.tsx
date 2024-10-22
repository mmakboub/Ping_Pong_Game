"use client";
import LeaderBoard from "./components/LeaderBoard/Leaderboard";
import Champions from "./components/Champions/Champions";
import FindRooms from "./components/FindPlay/FindRooms";
import Wrapper from "../components/Wrapper/Wrapper";

export default function home() {
  return (
    // the main div
    <Wrapper>
    <div className="flex h-screen w-full flex-col gap-5 overflow-y-auto bg-pageBackground sm:flex-row ">
      <LeaderBoard />
      <div className="flex w-full flex-col gap-5 sm:w-[30%]">
        <Champions />
        <FindRooms />
      </div>
    </div>
    </Wrapper>
  );
}
