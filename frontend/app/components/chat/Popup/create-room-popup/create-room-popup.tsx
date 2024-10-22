"use client";
import React, { useContext, useState } from "react";
import styles from "./RoomPopup.module.css";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import apiClient from "@/app/services/api-client";
import { ChatWebSocketContext } from "../../../../chat/context/chatWebsocketContext";
import { event } from "@/app/chat/socket-event/socket-event";
import { useRouter } from "next/navigation";
import { useGlobalUserContext } from "@/app/context/UserDataContext";
interface RoomPopupProps {
  trigger: boolean;
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
}

const schema = z.object({
  name: z
    .string()
    .min(1, { message: "name must be not empty !" })
    .max(20, { message: "Room's name to long !" }),
  type: z.enum(["1", "2", "3"]),
  password: z
    .string()
    .min(1, { message: "password must be not empty !" })
    .max(20, { message: "password to long !" }),
});
type FormData = z.infer<typeof schema>;

const RoomPopup = ({ trigger, setTrigger }: RoomPopupProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const [checkpassword, setCheckPassword] = useState(false);
  const router = useRouter();
  const socket = useContext(ChatWebSocketContext);
  const { userData } = useGlobalUserContext();
  // const password = watch("password", "");
  function createSharedRoom(
    path: string,
    entity: { name: string; type: string; password: string }
  ) {
    try {
      const request = apiClient.post(path, entity);
      return request;
    } catch (error) {
      console.error(error);
    }
  }
  const submitForm = (data: {
    name: string;
    type: string;
    password: string;
  }) => {
    createSharedRoom("chat/create-room", {
      name: data.name,
      type: data.type,
      password: data.password,
    })?.then((res) => {
      if (res.status === 201 && res.data) {
        socket.emit(event.CREATE_ROOM, {
          roomId: res.data.id,
          userId: userData.id,
        });
        setTrigger(false);
        router.push(`/chat/rooms/${res.data.id}`);
      }
    });
    reset();
  };
  return trigger ? (
    <div
      className={
        styles.popup +
        " fixed left-0 top-0 z-20 flex h-screen w-full items-center justify-center bg-popup "
      }
    >
      <form
        className="relative flex h-auto  w-1/2  max-w-[640px] flex-col justify-around rounded-2xl bg-background p-[32px]"
        onSubmit={handleSubmit(submitForm)}
      >
        <button
          className="absolute right-[16px] top-[10px]"
          onClick={() => setTrigger(false)}
        >
          <IoMdCloseCircleOutline
            className="text-primary hover:text-black "
            size={20}
          />
        </button>
        <input
          type="text"
          className="mx-auto mb-2 w-2/3 rounded-2xl border-2 border-fill bg-hover bg-opacity-0 p-2 pl-3 font-vietnam text-sm font-semibold tracking-wide text-fill placeholder-fill focus:border-white focus:text-white focus:outline-none"
          placeholder="choose the name for the room"
          {...register("name")}
        />
        {errors.name && (
          <p className="mb-8 text-center text-primary">{errors.name.message}</p>
        )}
        <h3 className="mb-8 text-center font-BeVietnamPro text-xl font-bold text-white">
          {"Choose the room's type !"}
        </h3>
        <ul className="mb-6 grid w-full gap-10 md:grid-cols-3">
          <li>
            <input
              type="radio"
              id="publict"
              value="1"
              {...register("type")}
              className="peer hidden"
              name="roomType"
              onChange={(e) => {
                setCheckPassword(false);
                setValue("type", "1");
                setValue("password", "default");
              }}
            />

            <label
              htmlFor="publict"
              className="inline-flex w-full cursor-pointer items-center justify-center rounded-lg border-4 border-fill bg-transparent p-2 text-fill hover:border-hr hover:text-hr peer-checked:border-primary peer-checked:text-primary "
            >
              <div className="block">
                <div className="w-full  text-lg font-semibold">Public</div>
              </div>
            </label>
          </li>
          <li>
            <input
              type="radio"
              id="protected"
              value="2"
              {...register("type")}
              className="peer hidden"
              name="roomType"
              onChange={(e) => {
                setCheckPassword(true);
                setValue("type", "2");
                setValue("password", "");
              }}
            />
            <label
              htmlFor="protected"
              className="inline-flex w-full cursor-pointer items-center justify-center rounded-lg border-4 border-fill bg-transparent p-2 text-fill hover:border-hr hover:text-hr peer-checked:border-primary peer-checked:text-primary "
            >
              <div className="">
                <div className="w-full text-lg font-semibold">Protected</div>
              </div>
            </label>
          </li>
          <li>
            <input
              type="radio"
              id="private"
              value="3"
              {...register("type")}
              className="peer hidden"
              name="roomType"
              onChange={(e) => {
                setCheckPassword(false);
                setValue("type", "3");
                setValue("password", "default");
              }}
            />
            <label
              htmlFor="private"
              className="inline-flex w-full cursor-pointer items-center justify-center rounded-lg border-4 border-fill bg-transparent p-2 text-fill hover:border-hr hover:text-hr peer-checked:border-primary peer-checked:text-primary "
            >
              <div className="block">
                <div className="w-full text-lg font-semibold">Private</div>
              </div>
            </label>
          </li>
        </ul>
        {errors.type && (
          <p className="mb-8 text-center text-primary">
            {"You must choose the room's type !"}
          </p>
        )}
        {checkpassword && (
          <div className="mb-6 flex flex-col gap-3 text-center">
            <label className="">
              <input
                {...register("password")}
                type="password"
                id="password"
                placeholder="password"
                className="mx-auto mb-2 w-1/3 rounded-2xl border-2 border-fill bg-hover bg-opacity-0 p-2 pl-3 font-vietnam text-sm font-semibold tracking-wide text-fill placeholder-fill focus:border-white focus:text-white focus:outline-none"
                name="roomType"
                onChange={(e) => setValue("password", e.target.value)}
              />
            </label>
            {/* <label className="">
              <input
                {...(register("password"), { required: true })}
                type="password"
                id="password"
                placeholder="password"
                className="mx-auto mb-2 w-1/3 rounded-2xl border-2 border-fill bg-hover bg-opacity-0 p-2 pl-3 font-vietnam text-sm font-semibold tracking-wide text-fill placeholder-fill focus:border-white focus:text-white focus:outline-none"
                name="roomType"
              />
            </label> */}
            {errors.password && (
              <p className="text-primary">{errors.password.message}</p>
            )}
          </div>
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            className=" h-auto w-auto rounded-2xl bg-fill px-10 py-2 font-BeVietnamPro text-[15px] font-bold text-white hover:bg-chatBackground hover:text-primary"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  ) : (
    ""
  );
};

export default RoomPopup;
