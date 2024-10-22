
'use client'
import Header from '../components/Header/Header'
import NavBar from '../components/NavBar/navBar'
import Settings from './components/Settings'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { CanceledError } from "axios";
import { useGlobalUserContext } from '../context/UserDataContext';
export default function Setting() {

  const {
    userData,
    setUserData,
  } = useGlobalUserContext();
  return (
    <main className='flex fixed flex-col-reverse  h-screen md:flex-row w-screen'>
      <NavBar />
      {/* main content */}
      <div className='flex flex-col overflow-hidden w-full gap-5 pb-5 h-full px-5'>
        <Header />
        {/* content */}
        <div className="w-full h-full flex flex-col overflow-y-auto p-6 gap-6 bg-[#353535]">

          {/* avatar part */}
          <div className='h-[35%] rounded-[20px] p-2  bg-[#242424] flex  gap-5'>
            <div className='h-full w-1/4 flex justify-end position relative '><Image src='/avatarBg.png' width="230" height="130" alt="" />
              <div className='h-full w-1/2 flex justify-end absolute'> <Image src='/avatar.png' width="230" height="130" alt="" />  </div>
            </div>
            <div className='h-full w-1/4 flex justify-end items-end '> <Image src='/fleche.webp' width="230" height="13" className='w-[30%]
                h-[20%] ' alt="" /></div>
            <div className='h-full w-1/4    flex items-center justify-center '> <h1 className=" text-2xl md:text-4xl font-bold font-vietnam text-white "> Welcome {userData.username}</h1> </div>
            <div className='h-full w-1/4 flex justify-start'> <Image src='/points.webp' width="230" height="130" className='w-[30%]
                h-[30%] 'alt="" /> </div>
          </div>

          {/*profile info part*/}
          <div className='h-[65%] select-none flex  gap-9'>
            <Settings />
          </div>
        </div>
      </div>
    </main>
  )
}
