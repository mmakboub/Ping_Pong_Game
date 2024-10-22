"use client";
import Image from "next/image";
import profile_service from "@/app/profile/service/profile";
import { useEffect, useState } from "react";
import { CanceledError } from "axios";
import { MdLeaderboard } from "react-icons/md";
import Link from "next/link";
import Wrapper from "@/app/components/Wrapper/Wrapper";
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

  achievements: any;
};

let users: User[] = [];
export default function Leaderboard() {
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
          className={`flex h-full w-full rounded-xl  sm:w-[70%]   ${!users.some((user) => user.matchPlayed !== 0) ? "bg-[#2F2F2F]" : "bg-background"} p-3`}
        >
          {!users.some((user) => user.matchPlayed != 0) ? (
            <div className="flex flex-grow flex-col items-center justify-center text-center font-BeVietnamPro text-[200px] font-extrabold text-primary">
              <div className="flex items-center justify-center">
                <MdLeaderboard className="mb-6" />
              </div>
              <p className="mb-4 text-[30px] font-bold text-white">
                Leaderboard
              </p>
              <p className="mb-4 text-[30px] font-bold text-white">
                No Player is Registered in the leaderboard
              </p>
              <p className="mb-4 text-[30px] font-bold text-white">
                Play and you&apos;ll be here!
              </p>
              <Link href="/game" passHref>
                <div className="flex h-12 w-52 cursor-pointer items-center justify-center rounded-2xl bg-hr text-center font-vietnam text-[15px] font-bold text-white hover:text-primary">
                  Play game
                </div>
              </Link>
            </div>
          ) : (
            <div className="flex w-[100%] flex-col items-center overflow-y-auto sm:w-[100%] ">
              <p className="text-center text-[30px] font-bold text-white">
                Leaderboard
              </p>
              {users.map((user, index) => (
                <div
                  key={index}
                  className="my-2 flex h-auto w-full flex-col  rounded-2xl bg-pageBackground py-3   md:flex-row"
                >
                  {/* Rank */}
                  <div className="flex flex-col lg:w-[10%] w-full items-center justify-center ">
                    <div>
                      <p className="text-center text-[20px] font-bold text-white">
                        #{index + 1}
                      </p>
                    </div>
                    <div>
                      <p className="text-center text-md  font-bold text-teal-500">
                        Rank
                      </p>
                    </div>
                  </div>

                  {/* User Picture and Name */}
                  <div className="flex flex-row items-center w-full justify-center lg:w-[40%] ">
                    <div className="h-[60px] w-[60px]">
                      <Image
                        src={user.pictureUrl}
                        alt="Picture of the author"
                        className="h-full w-full rounded-full object-cover"
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className="ml-2 flex flex-col">
                      <p className="text-center text-[15px] font-medium text-white">
                        {user.username}
                      </p>
                      <div className="ml-2 mt-2 flex justify-center">
                        <p className="text-center text-[15px] font-bold text-red-200">
                          XP {user.xp}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Matches Played */}
                  <div className="flex flex-col lg:w-[10%] w-full  items-center justify-center ">
                    <div>
                      <p className="text-center text-[20px] font-bold text-white">
                        #{user.matchPlayed}
                      </p>
                    </div>
                    <div>
                      <p className="text-center text-[20px] font-bold text-sky-500">
                        M.P
                      </p>
                    </div>
                  </div>

                  {/* Wins */}
                  <div className="flex flex-col lg:w-[10%] w-full items-center justify-center ">
                    <div>
                      <p className="text-center text-[20px] font-bold text-white">
                        #{user.matchWon}
                      </p>
                    </div>
                    <div>
                      <p className="text-center text-[20px] font-bold text-green-600">
                        Wins
                      </p>
                    </div>
                  </div>

                  {/* Losses */}
                  <div className="flex flex-col lg:w-[20%] w-full items-center justify-center ">
                    <div>
                      <p className="text-center text-[20px] font-bold text-white">
                        #{user.matchLost}
                      </p>
                    </div>
                    <div>
                      <p className="text-center text-[20px] font-bold text-red-700">
                        Losses
                      </p>
                    </div>
                  </div>

                  {/* Achievements */}
                  <div className="flex flex-col items-center w-full lg:w-[10%] justify-center ">
                    <div>
                      <p className="text-center text-[20px] font-bold text-white">
                        #
                        {
                          user.achievements.filter(
                            (achievement: { done: boolean }) => achievement.done
                          ).length
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-center text-[20px] font-bold text-yellow-600">
                        ACH
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
    </>
  );
}
