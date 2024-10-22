import { CanceledError } from "axios";
import { useEffect, useState } from "react";
import { MdLeaderboard } from "react-icons/md";
import profile_service from "@/app/profile/service/profile";
import Image from "next/image";

import { GiRank3 } from "react-icons/gi";
import { GiRank2 } from "react-icons/gi";
import { GiRank1 } from "react-icons/gi";
type User = {
  username: string;
  firstname: string;
  lastname: string;
  pictureUrl: string;
  matchLost: number;
  matchPlayed: number;
  matchWon: number;
  level: number;

  xp: number;

  achievemnts: any;
};

let users: User[] = [];
export default function Champions() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUsers = () => {
      const { request, cancel } =
        profile_service.getAll<User>("findall-users/");
      request
        .then((res) => {
          users = res.data;
          setLoading(false);
        })
        .catch((err) => {
          if (err instanceof CanceledError) return;
          setLoading(false);
        });
      return () => {
        cancel();
      };
    };
    fetchUsers();
  }, []);
  return (
    <>
      <div
        className={`h-[40%] w-full overflow-y-auto rounded-xl ${!users.some((user) => user.matchPlayed !== 0) ? "bg-[#2F2F2F]" : "bg-background"}`}
      >
        <div className="overflow-hidden rounded-xl">
          <div className=" w-full border-b bg-pageBackground p-4 font-vietnam font-bold  text-white  hover:text-primary">
            Champions
          </div>

          {users.slice(0, 3).map((user, index) => (
            <div
              className="flex h-full w-full flex-col items-center"
              key={index}
            >
              <div className="h-[33%] w-full ">
                <div
                  className="mx-4 my-4 flex flex-col 
                "
                >
                  <div className="flex  justify-between  gap-4">
                    <div>
                      <Image
                        src={user.pictureUrl}
                        alt="Picture of the author"
                        className="h-14 w-14 rounded"
                        width={56}
                        height={56}
                      />
                    </div>
                    <div className="flex flex-col justify-around font-vietnam text-white">
                      <h3 className="mb-1 text-center text-[15px] font-bold text-white duration-300 hover:cursor-pointer  hover:text-primary">
                        {user.username}
                      </h3>
                      <h6 className="text-[12px] font-bold text-fill">
                        Level {Math.floor(user.xp / 250)} --- XP {user.xp}
                      </h6>
                    </div>
                    <div className="flex ">
                      {index === 0 && (
                        <GiRank3 className="h-14 w-14 justify-end text-[#ffe550]" />
                      )}
                      {index === 1 && (
                        <GiRank2 className="h-14 w-14 justify-end text-[#a7a7a7]" />
                      )}
                      {index === 2 && (
                        <GiRank1 className="h-14 w-14 justify-end  text-[#ce793d]" />
                      )}
                    </div>
                  </div>
                </div>
                <hr className="w-4/5 self-center border-t border-hr" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
