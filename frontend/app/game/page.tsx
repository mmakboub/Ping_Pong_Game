"use client"

import Link from 'next/link'
import NavBar from '@/app/components/NavBar/navBar';
import Header from '../components/Header/Header';
import Play from './mode/play/page';
import SelectMap from './Components/SelectMap/selectMap';
import { MapProvider } from './mode/play/contexts/MapContext';
import { useState } from 'react';
import Wrapper from '../components/Wrapper/Wrapper';

export default function Game() {
  return (
    <Wrapper > 
      <main className='flex flex-col-reverse h-screen md:flex-row w-screen'>
        <NavBar />
        <div className='flex flex-col overflow-hidden w-full gap-5 pb-5 h-full px-5'>
          <Header />
          <SelectMap />
        </div>
      </main>
    </Wrapper > 
  );
};
