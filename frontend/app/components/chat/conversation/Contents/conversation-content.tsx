import { useGlobalUserContext } from "@/app/context/UserDataContext";
import { Msg } from "@/app/dtos/msg.dto";
import Image from "next/image";
import GameInvite from "../../Game-invitation/game-invitation";
import { User } from "@/app/dtos/user.dto";

interface Props {
  messages: Msg[];
  block: User[];
  blockBy: User[];
}
const ConversationContent = ({ messages, block, blockBy }: Props) => {
  const { userData } = useGlobalUserContext();
  return (
    <div className="flex h-full flex-col-reverse overflow-y-auto px-6">
      {/* chat msg  */}
      {messages.map((msg, index) =>
        !block.some((user) => user.id === msg.senderId) &&
        !blockBy.some((user) => user.id === msg.senderId) ? (
          <div
            key={index}
            className={`mt-3 flex flex-col gap-2 ${msg.senderId === userData.id ? "items-end" : "items-start"}`}
          >
            {msg.type === "TEXT" && (
              <>
                <div className="items-cente flex gap-4">
                  <div
                    className={`max-h-min w-auto self-end rounded-full ${msg.senderId === userData.id ? "order-2" : "order-0"}`}
                  >
                    <div className="h-[30px] w-[30px]">
                      <Image
                        src={msg.senderPicture}
                        width={100}
                        height={100}
                        alt="sender"
                        className="h-full w-full rounded-full object-cover"
                        priority
                        quality={100}
                      />
                    </div>
                  </div>
                  <div
                    className={`flex h-auto min-h-11 max-w-[300px] items-center  break-all rounded-t-2xl ${msg.senderId === userData.id ? "rounded-bl-2xl border-r-2 bg-[#f72727af]" : "rounded-br-2xl border-l-2 border-primary bg-white"} 
               px-3 py-1 font-vietnam text-[14px] font-bold text-black`}
                  >
                    {msg.content}
                  </div>
                </div>
                <div
                  className={`font-vietnam text-[10px] font-bold text-msgcolor ${msg.senderId === userData.id ? "self-end" : ""} `}
                >
                  {msg.time}
                </div>
              </>
            )}
            {msg.type === "EVENT" && (
              <div
                className={`max-w-1/2 flex h-auto min-h-11 flex-col self-center break-all  rounded-t-2xl px-3  
              py-2 text-center font-vietnam text-[13px] font-normal text-fill`}
              >
                -----{msg.content}-----
                <div>{msg.time}</div>
              </div>
            )}
            {msg.type === "INVITE_GAME" && <GameInvite msg={msg} />}

            {/* date  */}
          </div>
        ) : null
      )}
    </div>
  );
};

export default ConversationContent;
