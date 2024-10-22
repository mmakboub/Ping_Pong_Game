"use client";
import React, { useContext, useState } from "react";
import styles from "./joinRoom.module.css";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { set, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ChatWebSocketContext } from "@/app/chat/context/chatWebsocketContext";
import chatService from "@/app/chat/services/chat-service";
import { event } from "@/app/chat/socket-event/socket-event";
import { useGlobalUserContext } from "@/app/context/UserDataContext";
interface RoomPopupProps {
  trigger: boolean;
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  roomId: string;
  setIsMember: React.Dispatch<React.SetStateAction<boolean>>;
}

const schema = z.object({
  password: z.string().min(1, { message: "enter the password" }),
});
type FormData = z.infer<typeof schema>;

const JoinRoomPopup = ({
  trigger,
  setTrigger,
  roomId,
  setIsMember,
}: RoomPopupProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const chatSocket = useContext(ChatWebSocketContext);
  const { userData } = useGlobalUserContext();
  const [error, setError] = useState<string | null>(null);
  const submitForm = (data: { password: string }) => {
    chatService
      .add("room/member", {
        roomId: roomId,
        roomType: "PROTECTED",
        password: data.password,
      })
      .then((res) => {
        console.log("username: ", userData.username);
        if (res.status === 201) {
          chatSocket.emit(event.JOIN_NEW_ROOM, {
            roomId: roomId,
            userId: userData.id,
            username: userData.username,
          });
        }
        setIsMember(true);
        setTrigger(false);
        reset();
      })
      .catch((err) => {
        console.log("error: ", err);
        setError("Incorrect password");
      });
  };
  return trigger ? (
    <div
      className={
        styles.popup +
        " fixed left-0 top-0 z-[40] flex h-screen w-full items-center justify-center bg-popup "
      }
    >
      <form
        className="relative flex h-auto  w-1/2  max-w-[640px] flex-col justify-around rounded-2xl bg-background p-[32px]"
        onSubmit={handleSubmit(submitForm)}
      >
        <button
          className="test absolute right-[16px] top-[10px]"
          onClick={() => setTrigger(false)}
        >
          <IoMdCloseCircleOutline
            className="text-primary hover:text-black "
            size={20}
          />
        </button>
        <label
          htmlFor="password"
          className="mb-4 text-center font-BeVietnamPro text-xl font-bold text-white"
        >
          <p className="mb-3">{"This room's got a secret!"}</p>
          <p className="text-primary">Password required for entry.</p>
        </label>
        <input
          id="password"
          type="password"
          className="mx-auto mb-1 w-2/3 rounded-2xl border-2 border-fill bg-hover bg-opacity-0 p-2 pl-3 font-vietnam text-sm font-semibold tracking-wide text-fill placeholder-fill focus:border-white focus:text-white focus:outline-none"
          placeholder="enter password"
          {...register("password")}
        />
        {error && <p className="text-center text-primary">{error}</p>}
        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            className=" h-auto w-auto rounded-2xl bg-fill px-10 py-2 font-BeVietnamPro text-[15px] font-bold text-white hover:bg-chatBackground hover:text-primary"
          >
            Join
          </button>
        </div>
      </form>
    </div>
  ) : (
    ""
  );
};

export default JoinRoomPopup;
