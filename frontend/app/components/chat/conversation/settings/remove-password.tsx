import chatService from "@/app/chat/services/chat-service";
import styles from "../conversation.module.css";
interface RoomPopupProps {
  trigger: boolean;
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  roomId: string;
  setCheckSetting: React.Dispatch<React.SetStateAction<boolean>>;
  setRenderRoom: React.Dispatch<React.SetStateAction<boolean>>;
}

const RemovePasswordConfimation = ({
  trigger,
  setTrigger,
  roomId,
  setCheckSetting,
  setRenderRoom,
}: RoomPopupProps) => {
  const handleRemovePassword = () => {
    chatService
      .update("room/remove-password/" + roomId, {})
      .then(() => {
        setRenderRoom((prev) => !prev);
        setTrigger(false);
        setCheckSetting(false);
      })
      .catch((err) => {
        console.log("Error: in set password");
      });
  };
  return trigger ? (
    <div
      className={
        styles.popup +
        " fixed left-0 top-0 z-[40] flex h-screen w-full items-center justify-center bg-popup "
      }
    >
      <div className="flex w-1/3 flex-col justify-center rounded-xl bg-background p-6">
        <h3 className="mb-8 text-center font-BeVietnamPro text-xl font-bold text-white">
          are you sure you want to turn this room into a public room?
        </h3>
        <button
          className=" mb-3 h-auto w-auto rounded-2xl bg-fill px-10 py-2 font-BeVietnamPro text-[15px] font-bold text-white hover:bg-chatBackground hover:text-primary"
          onClick={() => handleRemovePassword()}
        >
          Remove
        </button>
        <button
          className=" h-auto w-auto rounded-2xl bg-fill px-10 py-2 font-BeVietnamPro text-[15px] font-bold text-white hover:bg-chatBackground hover:text-primary"
          onClick={() => setTrigger(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  ) : (
    ""
  );
};

export default RemovePasswordConfimation;
