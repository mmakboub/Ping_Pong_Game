import Image from "next/image";
import avatar from "@/app/public/images/avatars/avatar.jpeg";
import { User } from "@/app/dtos/user.dto";
import profile_service from "@/app/profile/service/profile";
import { useGlobalUserContext } from "@/app/context/UserDataContext";
import { useState, useEffect } from "react";
import axios, { CanceledError } from "axios";
import Link from "next/link";
import { TbFriendsOff } from "react-icons/tb";
import OnlineStatus from "@/app/components/online-status/online-status";
import { OnlineStateProvider } from "@/app/context/online-status-state";

interface Props {
  username: string;
}
interface Friends {
  friends: User[];
}
export default function Friends({ username }: Props) {
  // const [friendsLoaded, setFriendsLoaded] = useState(false);

  const [user, setUser] = useState<Friends | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchUserData = (username: string) => {
      try {
        const { request, cancel } = profile_service.getOne<Friends>(
          "user/friends/",
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
    };
    fetchUserData(username);
  }, [username]);
  if (!user) {
    return <></>;
  }

  return (
    <>
      {" "}
      <div className="flex h-full flex-col  rounded-xl bg-background  ">
        <div className="overflow-hidden rounded-xl">
          <div className=" w-full border-b-2 border-fill  p-4 font-vietnam font-bold  text-white ">
            My Friends
          </div>
        </div>

        {user.friends.length === 0 && (
          <div className="flex flex-grow flex-col items-center justify-center bg-[#2F2F2F] text-center font-BeVietnamPro text-[180px] font-extrabold text-primary">
            <div className="flex h-[50%] items-center justify-center">
              <TbFriendsOff />
            </div>
            <div className="flex h-[50%] items-start justify-center">
              <p className=" w-[70%] text-[25px] font-bold text-white">
                Looks like you&apos;re friendless for now.
              </p>
            </div>
          </div>
        )}
        <div className="max-h-[540px]  w-full  overflow-y-auto">
          {user.friends.map((friend, index) => (
            <Link href={`/profile/${friend.username}`} key={index}>
              <div className="mx-4 flex flex-col">
                <div className="my-4 flex justify-between">
                  <div className="flex justify-between gap-2">
                    <div>
                      <Image
                        src={friend.pictureUrl} // Replace with actual avatar source
                        alt="Picture of the author"
                        className="h-14 w-14 rounded"
                        width={56}
                        height={56}
                      />
                    </div>
                    <div className="flex flex-col justify-around font-vietnam text-white">
                      <h3 className="mb-1 text-[15px] font-bold text-white duration-300 hover:cursor-pointer  hover:text-primary">
                        {friend.username}
                      </h3>
                      <h6 className="text-[10px] font-semibold text-fill">
                        <OnlineStatus state={2} userId={friend.id} />
                      </h6>
                      <h6 className=" text-[12px] font-bold text-fill">
                        Level {Math.floor(friend.xp / 250)}
                      </h6>
                    </div>
                  </div>
                </div>
                <hr className="w-4/5 self-center border-t border-hr" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
