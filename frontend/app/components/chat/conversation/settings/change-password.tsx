import chatService from "@/app/chat/services/chat-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "../conversation.module.css";
import { z } from "zod";

interface RoomPopupProps {
  trigger: boolean;
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  roomId: string;
  setCheckSetting: React.Dispatch<React.SetStateAction<boolean>>;
}

const changePasswordSchema = z.object({
  oldPassword: z
    .string()
    .min(1, { message: "Old password required!" })
    .max(20, { message: "Password to long" }),
  newPassword: z
    .string()
    .min(4, { message: "Password to short" })
    .max(20, { message: "Password to long" }),
  confirmPassword: z
    .string()
    .min(4, { message: "Password to short" })
    .max(20, { message: "Password to long" }),
});

const ChangePasword = ({
  trigger,
  setTrigger,
  roomId,
  setCheckSetting,
}: RoomPopupProps) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });
  const [error, setError] = useState("");
  const onSubmit = (data: any) => {
    if (data.newPassword === data.confirmPassword) {
      chatService
        .update("room/change-password/" + roomId, data)
        .then((res) => {
          if (res.status === 201) {
            reset();
            setTrigger(false);
            setCheckSetting(false);
          }
        })
        .catch((err) => {
          setError("Incorrect password");
          console.log("Error: in set password");
        });
    } else {
      setError("Password not match");
    }
  };
  return trigger ? (
    <div
      className={
        styles.popup +
        " fixed left-0 top-0 z-[40] flex h-screen w-full items-center justify-center bg-popup "
      }
    >
      <div className="flex w-1/3 flex-col justify-center rounded-xl bg-background p-6">
        <h3 className="mb-5  text-center font-BeVietnamPro text-xl font-bold text-white">
          change password
        </h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center"
        >
          <label className="mt-4 flex w-full  rounded-lg">
            <input
              type="password"
              {...register("oldPassword")}
              placeholder="Enter old password"
              className="mx-auto mb-1 w-full rounded-xl border-2 border-fill bg-hover bg-opacity-0 p-2 pl-3 font-vietnam text-sm font-semibold tracking-wide text-fill placeholder-fill focus:border-white focus:text-white focus:outline-none"
            />
          </label>
          {errors.oldPassword && (
            <span className="text-sm text-red-600">
              {errors.oldPassword.message?.toString()}
            </span>
          )}
          <label className="mt-4 flex w-full flex-col rounded-lg">
            <input
              type="password"
              {...register("newPassword")}
              placeholder="Enter new password"
              className="mx-auto mb-1 w-full rounded-xl border-2 border-fill bg-hover bg-opacity-0 p-2 pl-3 font-vietnam text-sm font-semibold tracking-wide text-fill placeholder-fill focus:border-white focus:text-white focus:outline-none"
            />
          </label>
          {errors.newPassword && (
            <span className="text-sm text-red-600">
              {errors.newPassword.message?.toString()}
            </span>
          )}
          <label className="mt-4 flex w-full flex-col rounded-lg">
            <input
              type="password"
              id="confirmPassword"
              {...register("confirmPassword")}
              placeholder="Confirm password"
              className="mx-auto mb-2 w-full rounded-xl border-2 border-fill bg-hover bg-opacity-0 p-2 pl-3 font-vietnam text-sm font-semibold tracking-wide text-fill placeholder-fill focus:border-white focus:text-white focus:outline-none"
            />
          </label>
          {errors.confirmPassword && (
            <span className="mb-4 text-sm text-red-600">
              {errors.confirmPassword.message?.toString()}
            </span>
          )}
          {!errors.confirmPassword && (
            <span className="mb-4 text-red-600">{error}</span>
          )}
          <button
            type="submit"
            className="mb-3  h-auto w-2/3 items-center self-center rounded-2xl bg-fill px-10 py-2 font-BeVietnamPro text-[15px] font-bold text-white hover:bg-chatBackground hover:text-primary"
            // onClick={() => setTrigger(false)}
          >
            change password
          </button>
          <button
            className=" h-auto w-2/3 items-center self-center rounded-2xl bg-fill px-10 py-2 font-BeVietnamPro text-[15px] font-bold text-white hover:bg-chatBackground hover:text-primary"
            onClick={() => setTrigger(false)}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  ) : (
    ""
  );
};

export default ChangePasword;
