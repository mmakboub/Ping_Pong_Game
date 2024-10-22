import { WebsocketContext } from "../contexts/WebSocketContext";
import { useContext, useEffect, useState } from "react";
import { MapContext } from "../contexts/MapContext";
import Image from "next/image";
import { useGlobalUserContext } from "@/app/context/UserDataContext";

export default function ScoreBar() {
  const { userData } = useGlobalUserContext();
  const socket = useContext(WebsocketContext);
  const [p1score, setP1score] = useState(0);
  const [p2score, setP2score] = useState(0);
  const [localPlayerNo, setLocalPlayerNo] = useState(0);
  const [roomId, setRoomId] = useState(0);
  const { Map, setMap } = useContext(MapContext);

  const leaveButtonBgSrc = '/images/background/gameBg/' + Map + '/leaveButtonBg.svg';
  const scoreBgSrc = '/images/background/gameBg/' + Map + '/scoreBg.svg';

  const handleLeaveButton = () => {
    console.log(roomId, localPlayerNo);
    socket.emit("exit", {
			roomId: roomId,
			playerNo: localPlayerNo
		});
  };

  useEffect(() => {
    socket.on("roomid", (receivedRoomid: number) => {
			setRoomId(receivedRoomid);
    });
    socket.on("playerNo", (receivedPlayerNo: number) => {
      setLocalPlayerNo(receivedPlayerNo);
		});
    socket.on("updateGame", (room) => {
      if (room.players[0].username == userData.username)
        setLocalPlayerNo(1);
      else 
        setLocalPlayerNo(2);
      setRoomId(room.id);
      setP1score(room.players[0].score);
      setP2score(room.players[1].score);

    });

    return () => {
      socket.off('updateGame');
      socket.off('roomid');
      socket.off('playerNo');
    }
  }, [socket, userData.username]);
  return (
    <main className='flex relative w-full'>
      <Image width={200} height={200} className='w-full' src={scoreBgSrc} alt="" />
      <div className="absolute inset-0 flex flex-row mt-[5%] items-center justify-around">
        <div className='font-mono font-bold text-7xl text-white'>
          {p1score}
        </div>
        <button className='font-mono font-bold text-2xl text-center text-[#D74646] rounded hover:border-2  border-[#D74646]'
          onClick={handleLeaveButton}
          >
          <Image width={130} height={90} className="w-auto max-w-32" src={leaveButtonBgSrc} alt="" />
        </button>
        <div className='font-mono font-bold text-7xl text-white'>
          {p2score}
        </div>
      </div>
    </main>
  )
}
