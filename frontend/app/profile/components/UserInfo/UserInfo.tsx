"use client";
import Image from "next/image";
import profile1 from "@/app/public/images/profile1.png";
import avatar from "@/app/public/images/avatars/avatar.jpeg";
import Link from "next/link";
import { useGlobalUserContext } from "@/app/context/UserDataContext";
import { use, useEffect, useState } from "react";
import { User } from "@/app/dtos/user.dto";
import profile_service from "@/app/profile/service/profile";
import { CanceledError } from "axios";
import EditProfileButton from "../EditProfileButton/EditProfileButton";
import PlayGameButton from "../PlayGameButton/PlayGameButton";
import { notFound } from "next/navigation";
import styles from "./userInfo.module.css";
import AddFriend from "../addFriend/AddFriend";

interface Props {
  username: string;
}
export default function UserInfo({ username }: Props) {
  const { userData } = useGlobalUserContext();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    try {
      const { request, cancel } = profile_service.getOne<User>(
        "user/",
        username
      );
      request
        .then((res) => {
          setUser(res.data);
          setLoading(false);
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

  if (!user) {
    return <></>;
  }
  return (
    <>
      <div
        className={
          "flex h-1/2 justify-between rounded-xl border-b border-hr p-3 " +
          styles.background_image
        }
        // style={{ backgroundImage: "url('/images/bg-profile.png')" }}
      >
        <div className="flex flex-col justify-between gap-4 pl-3 pt-20">
          <div className="flex items-center">
            <div>
              <Image
                src={user.pictureUrl}
                alt="Picture of the author"
                className="h-16 w-16 rounded"
                width={64}
                height={64}
              />
            </div>
            <div className="pl-6 font-vietnam text-white">
              <h3 className="mb-1 font-BeVietnamPro text-[15px] font-bold">
                {user.firstname} {user.lastname}
              </h3>
              <h6 className="text- text-[13px] font-bold text-fill">
                {user.username}
              </h6>
              <h6 className="text-[13px] font-semibold text-notification">
                Level {Math.floor(user.xp / 250)}
              </h6>
            </div>
          </div>

          {/* play game button  */}

          <div className="flex">
            {username === userData.username && <PlayGameButton />}
            {/* {username !== userData.username && (
              <div className="flex items-end pb-4 pl-3">
                <button
                  className="box-shadow-md dark:shadow-x-gray-700 h-9 w-36 rounded-lg text-center font-vietnam text-[15px] font-medium text-white  dark:shadow-md "
                  style={{ backgroundColor: "#474646" }}
                >
                  Send message
                </button>
              </div>
            )} */}
          </div>
        </div>

        {/* image  */}
        <div className="right-[50%]">
          <Image src={profile1} alt="profile1" />
        </div>

        {/* Edit profile button  */}
        <div className="flex flex-col-reverse">
          {username === userData.username && <EditProfileButton />}
          {username !== userData.username && <AddFriend username={username} />}
        </div>
      </div>
    </>
  );
}
