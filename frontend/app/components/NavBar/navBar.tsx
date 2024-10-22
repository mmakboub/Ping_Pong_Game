"use client";
import "./navBar.css";

import { IoMdHome } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { GiPingPongBat } from "react-icons/gi";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { IoGameControllerOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import apiClient from "@/app/services/api-client";
import { useContext } from "react";
import { GlobalWebSocketContext } from "@/app/context/GlobalSocket";
import { GlobalOnlineSocketContext } from "@/app/context/online-status";

export default function NavBar() {
  const router = useRouter();
  const globalsocket = useContext(GlobalWebSocketContext);
  const onlineSocket = useContext(GlobalOnlineSocketContext);
  const Logout = () => {
    apiClient
      .get(`/auth/log-out`)
      .then(() => {
        globalsocket.disconnect();
        onlineSocket.disconnect();
        router.push("/auth");
      })
      .catch(() => {
        console.log("error in logout: ");
      });
  };
  return (
    <div className="navBar">
      <div className="hidden w-full text-center text-lg md:block">
        <GiPingPongBat className="m-auto h-11 w-14 xl:h-14 xl:w-16" />
      </div>
      <ul className="flex w-full justify-around md:h-2/4 md:flex-col md:justify-between md:px-4 lg:pl-4 lg:pr-0 xl:pl-6">
        <li className="navElement">
          <div
            className="flex items-center gap-8 "
            onClick={() => router.push("/home")}
          >
            <IoMdHome className="navBarIcons" />
            <span className="navBarElementTitle">Home</span>
          </div>
        </li>
        <li className="navElement">
          <div
            className="flex items-center gap-8"
            onClick={() => router.push("/profile")}
          >
            <CgProfile className="navBarIcons" />
            <span className="navBarElementTitle">Profile</span>
          </div>
        </li>
        <li className="navElement">
          <div
            className="flex items-center gap-8"
            onClick={() => router.push("/chat")}
          >
            <IoChatboxEllipsesOutline className="navBarIcons" />
            <span className="navBarElementTitle">Chat</span>
          </div>
        </li>
        <li className="navElement">
          <div
            className="flex items-center gap-8"
            onClick={() => router.push("/game")}
          >
            <IoGameControllerOutline className="navBarIcons" />
            <span className="navBarElementTitle">Game</span>
          </div>
        </li>
      </ul>
      <ul className="hidden h-1/6 justify-around md:flex md:w-full md:flex-col md:px-4 lg:pl-4 lg:pr-0 xl:pl-6">
        <li className=" navElement ">
          <div
            className="flex items-center gap-8"
            onClick={() => router.push("/setting")}
          >
            <IoSettingsOutline className="navBarIcons" />
            <span className="navBarElementTitle">Setting</span>
          </div>
        </li>
        <li className="navElement">
          <div className="flex items-center gap-8" onClick={Logout}>
            <IoLogOutOutline className="navBarIcons" />
            <span className="navBarElementTitle">Logout</span>
          </div>
        </li>
      </ul>
    </div>
  );
}
