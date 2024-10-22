"use client";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { User } from "@/app/dtos/user.dto";
import { useContext, useEffect, useState } from "react";
import { Room } from "@/app/dtos/room.dto";
import chatService from "@/app/chat/services/chat-service";
import styles from "./add-members.module.css";
import Image from "next/image";
import { IoMdPersonAdd } from "react-icons/io";
import { ChatWebSocketContext } from "@/app/chat/context/chatWebsocketContext";
import { useGlobalUserContext } from "@/app/context/UserDataContext";
interface RoomPopupProps {
  trigger: boolean;
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  room: Room;
}

function AddMembers({ trigger, setTrigger, room }: RoomPopupProps) {
  const [newMembers, setNewMembers] = useState<User[]>([]);
  const chatsocket = useContext(ChatWebSocketContext);
  const { userData } = useGlobalUserContext();
  const data: { id: string; username: string }[] = [];
  useEffect(() => {
    const controller = new AbortController();
    if (room) {
      const { request } = chatService.getAll<User>(
        "find-new-members/" + room.id
      );
      request
        .then((res) => {
          setNewMembers(res.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
    return () => {
      controller.abort();
    };
  }, [room]);
  const addMembers = () => {
    if (data.length > 0) {
      chatsocket.emit("add-members", {
        roomId: room.id,
        members: data,
        username: userData.username,
        userId: userData.id,
      });
    }
    setTrigger(false);
  };
  return trigger ? (
    <div
      className={
        " fixed left-0 top-0 z-[40] flex h-full w-full items-center justify-center  "
      }
    >
      <div className="relative flex flex-col items-center justify-center gap-4 rounded-xl bg-[#1C1C1C] px-6 py-4 opacity-100 transition-opacity duration-300">
        <h1 className="mb-2 w-full self-start border-b-[0.5px] pb-3 font-BeVietnamPro text-xl font-bold text-white">
          Add members
        </h1>
        <button
          className="absolute right-[10px] top-[10px]"
          onClick={() => setTrigger(false)}
        >
          <IoMdCloseCircleOutline
            className="text-primary hover:text-black "
            size={20}
          />
        </button>
        <div className="flex flex-col items-center">
          {newMembers.length === 0 && (
            <div className="text-white">No new members to add !</div>
          )}
          {newMembers.map((member, index) => {
            return (
              <div
                key={index}
                className={
                  styles.checkbox_wrapper_27 +
                  " w-[300px] border-b-[0.1px] border-[#575757] py-4"
                }
              >
                <label className={styles.checkbox + " flex justify-between"}>
                  <div className="flex items-center gap-4 text-white">
                    <div className="h-[60px] w-[60px]">
                      <Image
                        src={member.pictureUrl}
                        alt="avatar"
                        width={100}
                        height={100}
                        className="h-full w-full rounded-xl object-cover"
                      />
                    </div>
                    <div className="self-start font-BeVietnamPro font-bold">
                      {member.username}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        data.push({ id: member.id, username: member.username });
                      } else {
                        data.splice(
                          data.indexOf({
                            id: member.id,
                            username: member.username,
                          }),
                          1
                        );
                      }
                    }}
                  />
                  <span
                    className={styles.checkbox__icon + " self-center"}
                  ></span>
                </label>
              </div>
            );
          })}
          {}
          <button
            className={`mt-4 flex items-center gap-4 rounded-xl border border-[#575757] px-4 py-2 font-bold text-[#575757] ${newMembers.length === 0 ? "" : "hover:border-[#f82d41] hover:text-[#f82d41]"}`}
            onClick={addMembers}
            disabled={newMembers.length === 0}
          >
            <IoMdPersonAdd />
            Add
          </button>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default AddMembers;
