"use client";
import React, { useContext, useEffect, useState } from "react";
import { IoPersonAddSharp } from "react-icons/io5";
import notificationService from "../../service/notification";
import { FriendRequest, FriendResponse } from "@/app/dtos/friendRequest.dto";
import { CanceledError } from "axios";
import { FaUserFriends } from "react-icons/fa";
import { useGlobalUserContext } from "@/app/context/UserDataContext";
import { toast, Slide } from "react-toastify";
import { GlobalWebSocketContext } from "@/app/context/GlobalSocket";
import { useGlobalRenderNotifContext } from "@/app/context/renderNotif";
import { IoMdTime } from "react-icons/io";
interface Props {
  username: string;
}
const AddFriend = ({ username }: Props) => {
  const { userData } = useGlobalUserContext();
  const [status, setStatus] = useState<string>("ADDFRIEND");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const { request, cancel } = notificationService.getOne<FriendResponse>(
        "friend-check/",
        `${username}/${userData.username}`
      );
      request
        .then((res) => {
          setLoading(false);
          if (res.data) {
            if (res.data.status === "PENDING") {
              if (res.data.senderId === userData.username) {
                setStatus("ATTENTE");
              } else setStatus("ACCEPTFRIEND");
            } else if (res.data.status === "ACCEPTED") {
              setStatus("ACCEPTED");
            } else if (res.data.status === "REJECTED") {
              setStatus("REJECTED");
            }
          }
        })
        .catch((err) => {
          if (err instanceof CanceledError) return;
          setError(err.message);
          setLoading(false);
        });
      return () => {
        cancel();
      };
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [username, userData]);

  return (
    <div>
      {(status === "ADDFRIEND" || status === "REJECTED") && (
        <AddFriendButton username={username} setStatus={setStatus} />
      )}
      {status === "ATTENTE" && <Attente />}
      {status === "ACCEPTED" && <Friend />}
      {status === "ACCEPTFRIEND" && (
        <Accept username={username} setStatus={setStatus} />
      )}
    </div>
  );
};

export default AddFriend;

function AddFriendButton({
  username,
  setStatus,
}: {
  username: string;
  setStatus: (status: string) => void;
}) {
  const { userData } = useGlobalUserContext();
  const globalsocket = useContext(GlobalWebSocketContext);
  const notify = () =>
    toast.success(`Friend request sent to ${username}!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      transition: Slide,
    });
  const handleAddFriend = () => {
    notificationService
      .add<FriendRequest>(`friend-request/`, {
        senderId: userData.username,
        receiverId: username,
        id: "",
      })
      .then((res) => {
        if (res.data === "") {
          setStatus("ACCEPTFRIEND");
        } else {
          setStatus("ATTENTE");
          notify();
          globalsocket.emit("newFriendRequest", {
            receiverId: username,
            senderId: userData.username,
          });
        }
      });
  };
  return (
    <button
      className=" mb-4 mr-3 flex w-auto items-center justify-between gap-2 rounded-lg bg-[#474646] px-5 py-2 text-white  hover:cursor-pointer hover:text-primary"
      onClick={handleAddFriend}
    >
      <IoPersonAddSharp size={22} />
      <div className="w-auto font-vietnam text-[15px] font-medium">
        Add friend
      </div>
    </button>
  );
}
function Attente() {
  return (
    <div className=" mb-4 mr-3 flex w-auto items-center justify-between gap-2 rounded-lg bg-[#474646] px-5 py-2 text-white">
      <IoMdTime size={25} />
      <div className="w-full">Attente</div>
    </div>
  );
}
function Friend() {
  return (
    <div className=" mb-4 mr-3 flex w-auto items-center justify-between gap-2 rounded-lg bg-[#474646] px-5 py-2 text-white ">
      <div className="flex items-center justify-between gap-2">
        <FaUserFriends size={22} />
        <div className="w-auto font-vietnam text-[15px] font-medium">
          friend
        </div>
      </div>
    </div>
  );
}

function Accept({
  username,
  setStatus,
}: {
  username: string;
  setStatus: (status: string) => void;
}) {
  const { userData } = useGlobalUserContext();
  const { setRenderNotif } = useGlobalRenderNotifContext();
  const globalsocket = useContext(GlobalWebSocketContext);
  const handleAcceptFriend = () => {
    setStatus("ACCEPTED");
    notificationService
      .update<FriendRequest>("friend-accept/", {
        senderId: username,
        receiverId: userData.username,
        id: "",
      })
      .then((res) => {
        setRenderNotif((prev) => !prev);
        globalsocket.emit("friendRequestAccepted", {
          senderId: username,
          receiverId: userData.id,
        });
      });
  };
  return (
    <button
      className=" mb-4 mr-3 flex w-auto items-center justify-between gap-2 rounded-lg bg-[#474646] px-5 py-2 text-white  hover:cursor-pointer hover:text-primary "
      onClick={handleAcceptFriend}
    >
      <FaUserFriends size={22} />
      <div className="w-auto font-vietnam text-[15px] font-medium">Accepte</div>
    </button>
  );
}
