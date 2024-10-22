import { useGlobalUserContext } from "@/app/context/UserDataContext";
import { Room } from "@/app/dtos/room.dto";
import { useContext, useState } from "react";
import RemovePasswordConfimation from "./remove-password";
import ChangePasword from "./change-password";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import Image from "next/image";
import SetPassword from "./set-password";
import { MdAdd, MdOutlineRemoveModerator } from "react-icons/md";
import { AiTwotoneEdit } from "react-icons/ai";
import { BiRun } from "react-icons/bi";
import UserMember from "./user-member";
import AddMembers from "../../Popup/add-members/add-members";
import { ChatWebSocketContext } from "@/app/chat/context/chatWebsocketContext";

interface ChatSettingProps {
  setCheckSetting: React.Dispatch<React.SetStateAction<boolean>>;
  checkSetting: boolean;
  room: Room;
  setRenderRoom: React.Dispatch<React.SetStateAction<boolean>>;
}
function ChatSetting({
  setCheckSetting,
  checkSetting,
  room,
  setRenderRoom,
}: ChatSettingProps) {
  const { userData } = useGlobalUserContext();
  const [removePasswordConf, setRemovePasswordConf] = useState(false);
  const [changePasswordConf, setChangePasswordConf] = useState(false);
  const [addMember, setAddMember] = useState(false);

  return (
    <>
      <RemovePasswordConfimation
        trigger={removePasswordConf}
        setTrigger={setRemovePasswordConf}
        roomId={room.id}
        setCheckSetting={setCheckSetting}
        setRenderRoom={setRenderRoom}
      />
      <ChangePasword
        trigger={changePasswordConf}
        setTrigger={setChangePasswordConf}
        roomId={room.id}
        setCheckSetting={setCheckSetting}
      />

      <div
        className={`absolute right-0 top-0 z-20 flex h-full w-full transform flex-col justify-between  bg-[#303030] shadow-2xl transition-transform duration-300 ease-out ${checkSetting ? "translate-x-0" : "translate-x-full"}`}
      >
        <button
          className="absolute right-4 top-4 text-white duration-100 hover:text-primary"
          onClick={() => setCheckSetting(false)}
        >
          <FaRegArrowAltCircleRight size={25} />
        </button>
        <div className="h-full px-3">
          <h1 className=" border-b border-hover p-4 font-BeVietnamPro text-[30px] font-black text-white">
            Room settings
          </h1>
          <div className="flex w-full items-center justify-center gap-8  border-b border-hover  p-6 px-3 pb-10">
            <div className="flex flex-col items-center gap-2">
              <Image
                src={room.pictureUrl}
                alt="Picture of the author"
                className="rounded"
                width={100}
                height={100}
              />
              <div className="font-BeVietnamPro text-[20px] font-extrabold text-white">
                {room.name}
              </div>
            </div>
            {room.type === "PUBLIC" && room.ownerId == userData.id && (
              <div className="self-start">
                <SetPassword
                  roomId={room.id}
                  setCheckSetting={setCheckSetting}
                  setRenderRoom={setRenderRoom}
                />
              </div>
            )}
            {room.type === "PROTECTED" && room.ownerId == userData.id && (
              <div className="self-start">
                <button
                  className="mt-4 flex items-center gap-2 rounded-lg bg-[#373737] px-4 py-1 text-[14px] font-bold text-white hover:bg-opacity-50"
                  onClick={() => setRemovePasswordConf(true)}
                >
                  remove password <MdOutlineRemoveModerator />
                </button>
                <button
                  className="mt-4 flex items-center gap-2 rounded-lg bg-[#373737] px-4 py-1 text-[14px] font-bold text-white hover:bg-opacity-50"
                  onClick={() => setChangePasswordConf(true)}
                >
                  change password <AiTwotoneEdit />
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-5">
            <h1 className="border-b border-hover p-4 font-BeVietnamPro text-[20px] font-black text-white">
              Members
            </h1>
            <div className="flex max-h-[400px] min-h-max flex-col gap-2 overflow-y-auto ">
              {room.member.map((member, index) => {
                return (
                  <UserMember
                    key={index}
                    room={room}
                    member={member}
                    isAdmin={
                      room.admin.some((user) => user.id === userData.id) ||
                      room.ownerId === userData.id
                    }
                  />
                );
              })}
              <AddMembers
                trigger={addMember}
                setTrigger={setAddMember}
                room={room}
              />
            </div>
            {(room.admin.some((user) => user.id === userData.id) ||
              room.ownerId === userData.id) && (
              <button
                className="mx-auto w-full rounded-xl py-2 text-white duration-300 hover:bg-hover "
                onClick={() => setAddMember(true)}
              >
                <MdAdd className="mx-auto border-b-2   " size={35} />
              </button>
            )}
          </div>
        </div>
        <LeaveRoom room={room} />
      </div>
    </>
  );
}

export default ChatSetting;

interface LeaveRoomProps {
  room: Room;
}
function LeaveRoom({ room }: LeaveRoomProps) {
  const chatsocket = useContext(ChatWebSocketContext);
  const { userData } = useGlobalUserContext();
  const handleExit = () => {
    chatsocket.emit("leave-room", {
      userId: userData.id,
      roomId: room.id,
      username: userData.username,
    });
  };
  return (
    <div className="flex w-full items-center justify-center border-t border-hover bg-[#373737] py-4 text-red-600 duration-300 hover:cursor-pointer hover:bg-hover ">
      <button
        className=" flex items-center gap-3 font-bold"
        onClick={() => handleExit()}
      >
        <BiRun size={20} />
        leave room
      </button>
    </div>
  );
}
