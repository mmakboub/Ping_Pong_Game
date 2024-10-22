"use client"

import Link from 'next/link'
import NavBar from '@/app/components/NavBar/navBar';
import { useEffect, useState } from 'react';
import Header from '@/app/components/Header/Header';
import SelectMode from './Components/SelectMode/selectMode';
import { WebsocketProvider, socket } from './play/contexts/WebSocketContext';
import Wrapper from '@/app/components/Wrapper/Wrapper';

export default function Mode() {

  return (
    <Wrapper > 

    <main className='flex flex-col-reverse h-screen md:flex-row w-screen'>
      <NavBar />
      <div className='flex flex-col overflow-hidden w-full gap-5 pb-5 h-full px-5'>
        <Header />
        <WebsocketProvider value={socket}>
            <SelectMode />
        </WebsocketProvider>
      </div>
    </main>
    </Wrapper>
  );
};
