"use client";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { IoIosSend } from "react-icons/io";
import { set, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useEffect, useState } from "react";
interface InputMsgProps {
  onSubmit: (msg: string) => void;
}

const schema = z.object({
  msg: z.string().min(1),
});

type FormData = z.infer<typeof schema>;

const InputMsg = ({ onSubmit }: InputMsgProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const [showEmoji, setShowEmoji] = useState(false);

  const handleEmoji = (e: any) => {
    const sym = e.unified.split("_");
    const codeArray: any = [];
    sym.forEach((el: any) => {
      codeArray.push("0x" + el);
    });
    let emoji = String.fromCodePoint(...codeArray);
    setValue("msg", getValues("msg") + emoji);
  };
  return (
    <form
      className="relative flex min-h-[83px] w-full justify-between gap-2 px-10 pb-3 "
      onSubmit={handleSubmit((data) => {
        onSubmit(data.msg.charAt(0).toUpperCase() + data.msg.slice(1));
        reset();
      })}
    >
      {/* emoji picker */}
      {showEmoji && (
        <div className="absolute top-[-550%] rounded-xl bg-black">
          <Picker
            data={data}
            theme="dark"
            emojiSize={30}
            onClickOutside={() => setShowEmoji(false)}
            maxFrequentRows={0}
            onEmojiSelect={handleEmoji}
          />
        </div>
      )}
      <div className="flex w-full items-center justify-evenly rounded-2xl bg-background">
        {/* emoji */}
        <button
          className="h-[50px] w-[60px] border-r border-hr px-2  text-center"
          type="button"
          onClick={() => setShowEmoji(!showEmoji)}
        >
          <MdOutlineEmojiEmotions
            size={40}
            className=" text-primary duration-300 hover:text-msgcolor"
          />
        </button>
        {/* input msg */}
        <input
          className="flex w-4/5 bg-background font-vietnam text-white focus:outline-none"
          placeholder="Type a message ..."
          {...register("msg")}
          type="text"
        />
        {/* add user id here */}
        {/* <input type="hidden" />  */}
      </div>
      {/* send button */}
      <button className="pl-2" type="submit">
        <IoIosSend className="h-10 w-10 text-primary duration-300 hover:text-msgcolor" />
        <div className="font-bold text-msgcolor ">Send</div>
      </button>
    </form>
  );
};

export default InputMsg;
