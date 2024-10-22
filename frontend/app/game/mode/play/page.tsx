"use client"

import Link from 'next/link'
import Canvas from "./Canvas/Canvas"
import React, { useEffect, useRef, useState } from 'react';
import { WebsocketContext, WebsocketProvider, socket } from './contexts/WebSocketContext';
import LeftPlayer from './components/LeftPlayer';
import RightPlayer from './components/RightPlayer';
import ScoreBar from './components/ScoreBar';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import router, { useRouter } from 'next/navigation';
import { CiDesktopMouse1 } from "react-icons/ci";



export default function Play() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (socket.connected) {
            socket.emit("checkIfInGame");
            socket.on("checkIfInGameResponse", (response: boolean) => {
                if (!response) {
                    router.push('/game');
                }
                setLoading(false);
            })
        }
        else
            router.push('/game');
        return () => {
            socket.off('checkIfInGameResponse');
        }
    }, [router]);
    if (loading) {
        return (
            <div className="relative z-[1] flex w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-xl bg-chatBackground">
                <div className="flex h-screen items-center justify-center">
                    <div className="h-16 w-16 animate-spin rounded-full border-b-4 border-primary"></div>
                </div>
            </div>
        )
    }
    return (
        <main className='mt-[3%] flex max-w-[1440px] mx-auto border'>
            <div className='fles flex-row'>
            <div className='flex flex-col'>
                <div className=' flex basis-1/6 flex-row flex-wrap md:flex-nowrap'>
                    <div className='grow basis-1/4 order-0'>
                        <LeftPlayer />
                    </div>
                    <div className='grow order-2 md:order-1'>
                        <ScoreBar />
                    </div>
                    <div className='grow basis-1/4 order-1 md:order-2'>
                        <RightPlayer />
                    </div>
                </div>
                <div className='flex basis-10/12 flex-row'>
                    {/* left panel div */}
                    <div className='grow basis-1/4 hidden md:flex'>
                        <LeftPanel />
                    </div>
                    {/* canvas div */}
                    <div className='grow flex md:justify-center md:items-center'>
                        <div className=' w-full '>
                            <Canvas width={600} height={400} />
                        </div>
                    </div>
                    {/* right pannel div */}
                    <div className='grow bg-green-100 basis-1/4 hidden md:flex'>
                        <RightPanel />
                    </div>
                </div>
            </div>
                <div className='text-center font-mono text-xl font-bold border'>
                    <div className='text-white'>
                        How to play:
                    </div>
                    <div className='text-white'>
                        <div className='flex justify-center items-center'>
                            <CiDesktopMouse1 size={70}/>
                        </div>
                        Move your mouse inside the board to move the paddle
                        
                    </div>

                </div>

            </div>
        </ main >
    )
}
