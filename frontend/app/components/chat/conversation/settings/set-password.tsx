import chatService from "@/app/chat/services/chat-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { TbPasswordUser } from "react-icons/tb";
import { z } from "zod";

const schema = z.object({
  password: z
    .string()
    .min(4, { message: "Password to short" })
    .max(20, { message: "Password to long" }),
  confirmPassword: z
    .string()
    .min(4, { message: "Password to short" })
    .max(20, { message: "Password to long" }),
});
interface SetPasswordProps {
  roomId: string;
  setCheckSetting: React.Dispatch<React.SetStateAction<boolean>>;
  setRenderRoom: React.Dispatch<React.SetStateAction<boolean>>;
}
function SetPassword({
  roomId,
  setCheckSetting,
  setRenderRoom,
}: SetPasswordProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const [error, setError] = useState("");
  const onSubmit = (data: any) => {
    if (data.password === data.confirmPassword) {
      chatService
        .update("room/set-password/" + roomId, data)
        .then(() => {
          setRenderRoom((prev) => !prev);
          setCheckSetting(false);
          reset();
        })
        .catch(() => {
          setError("Error: in set password");
        });
    } else {
      setError("Password not match");
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-4 self-start rounded-lg bg-[#373737] px-4 py-2  text-[14px] font-bold text-white hover:bg-opacity-50"
      >
        set password <TbPasswordUser />
      </button>
      <label className="mt-4 flex w-full flex-col rounded-lg">
        <input
          type="password"
          {...register("password")}
          placeholder="Enter password"
          className="mx-auto mb-1 w-full rounded-xl border-2 border-fill bg-hover bg-opacity-0 p-1 pl-3 font-vietnam text-sm font-semibold tracking-wide text-fill placeholder-fill focus:border-white focus:text-white focus:outline-none"
        />
      </label>
      {errors.password && (
        <span className="text-sm text-red-600">
          {errors.password.message?.toString()}
        </span>
      )}
      <label className="mt-4 flex w-full flex-col rounded-lg">
        <input
          type="password"
          id="confirmPassword"
          {...register("confirmPassword")}
          placeholder="Confirm password"
          className="mx-auto mb-1 w-full rounded-xl border-2 border-fill bg-hover bg-opacity-0 p-1 pl-3 font-vietnam text-sm font-semibold tracking-wide text-fill placeholder-fill focus:border-white focus:text-white focus:outline-none"
        />
      </label>
      {errors.confirmPassword && (
        <span className="text-sm text-red-600">
          {errors.confirmPassword.message?.toString()}
        </span>
      )}
      {!errors.confirmPassword && <span className="text-red-600">{error}</span>}
    </form>
  );
}

export default SetPassword;
