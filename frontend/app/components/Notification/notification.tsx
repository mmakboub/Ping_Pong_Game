import { useEffect, useState } from "react";
import Image from "next/image";
import { useGlobalUserContext } from "@/app/context/UserDataContext";
import { useGlobalRenderNotifContext } from "@/app/context/renderNotif";
import { FriendResponse } from "@/app/dtos/friendRequest.dto";
import AcceptButton from "../accept-friend/accepte-friend";
import RejectFriend from "../reject-friend/reject-friend";
import notificationService from "@/app/profile/service/notification";
import { CanceledError } from "axios";
import { MdOutlineNotifications } from "react-icons/md";
import { IoNotificationsOffCircleOutline } from "react-icons/io5";
import styles from "./notification.module.css";

function RequestNotification({ request }: { request: FriendResponse }) {
  // const [onAccept, setOnAccept] = useState(true);
  return (
    <div className={`mt-3  flex gap-6 rounded-2xl bg-history p-3`}>
      <div className="flex items-center  gap-3">
        <div className="h-[50px] w-[50px]">
          <Image
            src={request.sender.pictureUrl}
            alt="Picture of the author"
            className="h-full w-full rounded-full"
            width={48}
            height={48}
            priority
          />
        </div>
        <div className="flex w-[200px] flex-col items-start">
          <div className="font-vietnam text-lg font-bold">
            {request.sender.username}
          </div>
          <div className="font-vietnam text-sm font-normal">
            Sent you a friend request
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <AcceptButton sender={request.sender.username} />
        <RejectFriend sender={request.sender.username} />
      </div>
    </div>
  );
}
function Notification() {
  // const [notification, setNotification] = useState({ number: 0 });
  const { userData } = useGlobalUserContext();
  const [notifToggle, setNotifToggle] = useState(false);
  const [friendRequest, setFriendRequest] = useState<FriendResponse[]>([]);
  const { renderNotif, setRenderNotif } = useGlobalRenderNotifContext();

  const handleClickMore = () => {
    setNotifToggle(true);
  };
  useEffect(() => {
    let handler = () => {
      setNotifToggle(false);
    };

    document.addEventListener("mousedown", handler);
  });

  useEffect(() => {
    const { request, cancel } = notificationService.getAllFor<FriendResponse>(
      "friend-request/",
      userData.username
    );
    request
      .then((res) => {
        setFriendRequest(res.data);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        console.log(err);
      });
    return () => {
      cancel();
    };
  }, [renderNotif, userData.username]);
  return (
    <div onClick={handleClickMore} className="relative">
      {friendRequest.length !== 0 && (
        <div className=" absolute right-0 min-w-4 rounded-xl bg-notification text-center text-9 font-extrabold text-black ">
          {friendRequest.length}
        </div>
      )}
      <MdOutlineNotifications className="h-7 w-7 hover:cursor-pointer hover:rounded hover:bg-hover" />
      <div
        className={`absolute right-0 top-12 z-10 h-auto w-auto rounded-2xl bg-[#303030] p-2 ${notifToggle ? styles.active : styles.inactive}
            before:absolute before:right-[20px] before:top-[-5px] before:h-[20px] before:w-[20px] before:rotate-45 before:bg-[#303030]`}
      >
        {friendRequest.length === 0 && (
          <div className="h-[200px] w-[200px]">
            <div className="flex h-full w-full flex-col items-center justify-center">
              <IoNotificationsOffCircleOutline size={100} />
              <div className="text-center font-vietnam text-2xl font-bold">
                No new notifications
              </div>
            </div>
          </div>
        )}
        {friendRequest.map((request, index) => {
          return <RequestNotification key={index} request={request} />;
        })}
      </div>
    </div>
  );
}

export default Notification;
