import { useContext, useEffect, useState } from "react";
import { WebsocketContext } from "../contexts/WebSocketContext";
import Image from "next/image";

export default function RightPlayer() {
    const socket = useContext(WebsocketContext);

	const [p2username, setP2username] = useState("");
	const [p2picture, setP2picture] = useState("/images/background/selectModeBg/loadingInWhite.svg");

    useEffect(() => {
        socket.on("startingGame", (room) => {
          setP2username(room.players[1].username);
          setP2picture(room.players[1].picture);
        });
    
        socket.on("updateGame", (room) => {
            setP2username(room.players[1].username);
            setP2picture(room.players[1].picture);
		});
    
        return () => {
            socket.off('updateGame');
          socket.off('startingGame');
        }
      }, [socket])
    return (
        <main className=" flex h-full w-full bg-[#3D3D3D]">
            <div className="flex justify-center item-center ml-4">
                <Image width={100} height={100} className="object-cover my-auto h-24 w-24 " src={p2picture} alt="" />
            </div>
            <div className=" my-auto ml-3">
                <div className="">
                    <p className="text-white font-black text-xl font-BeVietnamPro">{p2username}</p>
                </div>
                <div className="">
                    <p className="text-[#BDBDBD] text-base font-BeVietnamPro font-bold"></p>
                </div>
            </div>
        </main>
    )
}
