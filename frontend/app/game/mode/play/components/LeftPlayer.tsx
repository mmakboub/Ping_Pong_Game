import { useContext, useEffect, useState } from "react";
import { WebsocketContext } from "../contexts/WebSocketContext";
import Image from "next/image";
import { useGlobalUserContext } from "@/app/context/UserDataContext";

export default function LeftPlayer() {

    const socket = useContext(WebsocketContext);

    const [p1username, setP1username] = useState("");
	const [p1picture, setP1picture] = useState("/images/background/selectModeBg/loadingInWhite.svg");

    useEffect(() => {
        socket.on("startingGame", (room) => {
          setP1username(room.players[0].username);
          setP1picture(room.players[0].picture);
        });

        socket.on("updateGame", (room) => {
            setP1username(room.players[0].username);
            setP1picture(room.players[0].picture);
		});
    
        return () => {
            socket.off('updateGame');
            socket.off('startingGame');
        }
      }, [socket])

    return (
        <main className=" flex h-full w-full bg-[#3D3D3D]">
            <div className="flex justify-center item-center ml-4">
                <Image width={100} height={100}  className="object-cover my-auto h-24 w-24 " src={p1picture} alt="player1pic" />
            </div>
            <div className=" my-auto ml-3">
                <div className="">
                    <p className="text-white font-black text-xl font-BeVietnamPro">{p1username}</p>
                </div>
                <div className="">
                    <p className="text-[#BDBDBD] text-base font-BeVietnamPro font-bold"></p>
                </div>
            </div>
        </main>
    )
}
