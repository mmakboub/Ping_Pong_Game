"use client";

import { use, useContext, useEffect, useRef, useState } from "react";
import { WebsocketContext } from "../contexts/WebSocketContext";
import Player from "./player";
import { Ball } from "./ball";
import { useRouter } from "next/navigation";
import { MapContext } from "../contexts/MapContext";
import { useGlobalUserContext } from "@/app/context/UserDataContext";
import { GlobalOnlineSocketContext } from "@/app/context/online-status";

interface CanvasProps {
  width: number;
  height: number;
}

export default function Canvas(canvasProps: CanvasProps) {
  const { userData } = useGlobalUserContext();
  const { Map, setMap } = useContext(MapContext);
  const onlineSocket = useContext(GlobalOnlineSocketContext);
  const backgroundImage = "/images/background/gameBg/boards/" + Map + ".svg";
  let borderColor: string = "#D74646";
  if (Map == "defaultMap") borderColor = "white";
  else if (Map == "autoMap") borderColor = "#D74646";
  else if (Map == "classicMap") borderColor = "black";
  else if (Map == "iceMap") borderColor = "#3D3D3D";
  else if (Map == "bananaMap") borderColor = "#008000";

  const cavasRef = useRef<HTMLCanvasElement>(null);
  const startBtnRef = useRef<HTMLButtonElement>(null);
  const messageRef = useRef<HTMLParagraphElement>(null);

  const router = useRouter();
  const socket = useContext(WebsocketContext);

  useEffect(() => {
    const canvas = cavasRef?.current;
    const message = messageRef?.current;
    const context = canvas?.getContext("2d");

    let player1: Player;
    let player2: Player;
    let ball: Ball;
    let isGameRunning = false;
    let localPlayerNo = 0;
    let roomId: number;

    onlineSocket.emit("in-game", userData.id);
    const handleMouseMove = (event: MouseEvent) => {
      if (isGameRunning) {
        const rect = canvas?.getBoundingClientRect();
        if (!rect) return null;
        const y = event.clientY - rect.top;

        socket.emit("move", {
          roomId: roomId,
          playerNo: localPlayerNo,
          newY: y,
        });
      }
    };

    socket.on("playerNo", (receivedPlayerNo: number) => {
      console.log("receivedPlayerNo", receivedPlayerNo);
      localPlayerNo = receivedPlayerNo;
    });

    socket.on("startingGame", () => {
      isGameRunning = true;
      if (message) message.innerText = "We are going to start the game...";
    });
    player1 = new Player(0, 150, 10, 100, "#D74646", 0);
    player2 = new Player(590, 150, 10, 100, "#D74646", 0);
    ball = new Ball(300, 200, 10, "white");

    socket.on("startedGame", (room) => {
      roomId = room.id;
      if (message) message.innerText = "";

      // control player
      canvas?.addEventListener("mousemove", handleMouseMove);
      render();
    });

    socket.on("updateGame", (room) => {
      player1.y = room.players[0].y;
      player2.y = room.players[1].y;

      if (!isGameRunning) {
        isGameRunning = true;
        roomId = room.id;
        canvas?.addEventListener("mousemove", handleMouseMove);
        if (userData.username == room.players[0].username) localPlayerNo = 1;
        else localPlayerNo = 2;
      }

      player1.score = room.players[0].score;
      player2.score = room.players[1].score;

      ball.x = room.ball.x;
      ball.y = room.ball.y;
      render();
    });

    // render the game
    function render() {
      if (canvas) {
        context?.clearRect(0, 0, canvas.width, canvas.height);
        if (Map == "defaultMap") {
          player1.color = "white";
          player2.color = "white";
          ball.color = "white";
        } else if (Map == "autoMap") {
          player1.color = "#D74646";
          player2.color = "#D74646";
          ball.color = "white";
        } else if (Map == "classicMap") {
          player1.color = "black";
          player2.color = "black";
          ball.color = "black";
        } else if (Map == "iceMap") {
          player1.color = "#3D3D3D";
          player2.color = "#3D3D3D";
          ball.color = "#3D3D3D";
        } else if (Map == "bananaMap") {
          player1.color = "#008000";
          player2.color = "#008000";
          ball.color = "#008000";
        }
        player1.draw(context);
        player2.draw(context);
        ball.draw(context);
      }
    }

    socket.on("endGame", (room) => {
      isGameRunning = false;
      if (message) {
        message.style.fontSize = "100px";
        message.innerText = `${room.winner === localPlayerNo ? "YOU WON!" : "YOU LOST!"}`;
      }
      socket.emit("leave", room);

      setTimeout(() => {
        context?.clearRect(0, 0, canvasProps.width, canvasProps.height);
        router.push("/game/mode");
      }, 3000);
    });

    return () => {
      // clearInterval(gameLoop);
      canvas?.removeEventListener("mousemove", handleMouseMove);
      onlineSocket.emit("out-game", userData.id);
      socket.off("playerNo");
      socket.off("startingGame");
      socket.off("startedGame");
      socket.off("updateGame");
      socket.off("endGame");
    };
  }, [
    Map,
    canvasProps.height,
    canvasProps.width,
    router,
    socket,
    userData.username,
    onlineSocket,
    userData.id,
  ]);

  return (
    <main className="w-full">
      <div
        className="relative flex w-full flex-col items-center justify-center border"
        style={{
          backgroundImage: `url("${backgroundImage}")`,
          borderColor: borderColor,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <canvas
          className=" w-full"
          style={{ cursor: "none" }}
          ref={cavasRef}
          {...canvasProps}
        />
        <p
          className="absolute text-center font-mono text-6xl font-bold text-white"
          ref={messageRef}
        ></p>
      </div>
    </main>
  );
}
