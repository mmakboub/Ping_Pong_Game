"use client";

import React from "react";
import ProfileInfo from "./ProfileInfo";

import Security from "./Security";
import Wrapper from "@/app/components/Wrapper/Wrapper";


export default function App() {

  return (
    <Wrapper>
      <div className="flex h-auto w-screen flex-col lg:flex-row gap-5  rounded-xl">
        {/* styling & handling Vertical tabs */}
        <div className=" flex h-full w-full lg:w-1/2 flex-col justify-start rounded-xl bg-[#3D3D3D]  ">
          <ProfileInfo /> </div>
        <div className=" flex h-full w-full lg:w-1/2  flex-col justify-start rounded-xl bg-[#3D3D3D]  ">
          <Security />
        </div>
      </div>
    </Wrapper>
  );
}
