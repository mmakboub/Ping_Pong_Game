"use client";
import Achievement from "./components/Achievement/Achievement";
import Friends from "./components/Friends/Friends";
import Card from "./components/Card/Card";
import Historique from "./components/Historique/Historique";
import UserInfo from "./components/UserInfo/UserInfo";
import { useState } from "react";
import { useGlobalUserContext } from "../context/UserDataContext";
import PopupForm from "./popUp/PopupForm";
import Wrapper from "../components/Wrapper/Wrapper";
export default function Profile() {
  const { userData } = useGlobalUserContext();


  return (
    <>
      <Wrapper>
        {userData.isfirsttime && userData.id !== "" && (
          <PopupForm />
        )}
        <div className="flex h-screen w-full flex-col gap-5 overflow-y-auto bg-pageBackground  md:flex-row">
          <div className="flex h-full w-full flex-col gap-4 rounded-xl  md:w-3/4 ">
            <UserInfo username={userData.username} />

            <div className="flex h-full w-full flex-col  gap-4 rounded-xl md:flex-row">
              <div className=" overflow-hidden rounded-xl md:w-1/3">
                <Friends username={userData.username} />
              </div>

              <Historique username={userData.username} />
            </div>
          </div>

          <div className="flex w-full flex-col gap-5 md:w-1/4 ">
            <Card username={userData.username} />
            <Achievement username={userData.username} />
          </div>
        </div>
      </Wrapper>
    </>
  );
}
