"use client";
import Image from "next/image";
import unlockedAch1 from "@/app/public/images/Achievements/unlockedAch1.png";
import unlockedAch2 from "@/app/public/images/Achievements/unlockedAch2.png";
import unlockedAch3 from "@/app/public/images/Achievements/unlockedAch3.png";
import unlockedAch4 from "@/app/public/images/Achievements/unlockedAch4.png";
import unlockedAch5 from "@/app/public/images/Achievements/unlockedAch5.png";
import unlockedAch6 from "@/app/public/images/Achievements/unlockedAch6.png";
import unlockedAch7 from "@/app/public/images/Achievements/unlockedAch7.png";
import unlockedAch8 from "@/app/public/images/Achievements/unlockedAch8.png";
import lockedAch1 from "@/app/public/images/Achievements/lockedAch1.png";
import lockedAch2 from "@/app/public/images/Achievements/lockedAch2.png";
import lockedAch3 from "@/app/public/images/Achievements/lockedAch3.png";
import lockedAch4 from "@/app/public/images/Achievements/lockedAch4.png";
import lockedAch5 from "@/app/public/images/Achievements/lockedAch5.png";
import lockedAch6 from "@/app/public/images/Achievements/lockedAch6.png";
import lockedAch7 from "@/app/public/images/Achievements/lockedAch7.png";
import lockedAch8 from "@/app/public/images/Achievements/lockedAch8.png";

import avatar from "@/app/public/images/avatars/avatar.jpeg";
import profile1 from "@/app/public/images/profile1.png";
import level from "@/app/public/images/level.png";
import profile_service from "@/app/profile/service/profile";
import { url } from "inspector";
import { IoSearchSharp } from "react-icons/io5";
import { useEffect, useState } from "react";
import { CanceledError } from "axios";
import { User } from "@/app/dtos/user.dto";

interface Props {
  username: string;
}
const UserDataList = [
  { name: "picture of the author", picture: avatar },
  { name: "level profile", picture: level },
  { name: "lockedAch1", picture: lockedAch1 },
  { name: "unlockedAch1", picture: unlockedAch1 },
  { name: "lockedAch2", picture: lockedAch2 },
  { name: "unlockedAch2", picture: unlockedAch2 },
  { name: "lockedAch3", picture: lockedAch3 },
  { name: "unlockedAch3", picture: unlockedAch3 },
  { name: "lockedAch4", picture: lockedAch4 },
  { name: "unlockedAch4", picture: unlockedAch4 },
  { name: "lockedAch5", picture: lockedAch5 },
  { name: "unlockedAch5", picture: unlockedAch5 },
  { name: "lockedAch6", picture: lockedAch6 },
  { name: "unlockedAch6", picture: unlockedAch6 },
  { name: "lockedAch7", picture: lockedAch7 },
  { name: "unlockedAch7", picture: unlockedAch7 },
  { name: "lockedAch8", picture: lockedAch8 },
  { name: "unlockedAch8", picture: unlockedAch8 },

  { name: "profile1", picture: profile1 },
];

export default function Achievement({ username }: Props) {
  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

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
  }, [username]);

  if (!user) {
    return <></>;
  }

  function searchByType(array: any, type: string) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].type === type) {
            return array[i];
        }
    }
    return null; // If object with given type is not found
}

  return (
    <>
      {" "}
      <div
        className={`h-full  rounded-xl bg-background ${
          isModalOpen ? "blurred" : ""
        }`}
      >
        <button
          onClick={openModal}
          className="h-[75px] w-full border-b-2 border-fill  font-vietnam font-bold text-white duration-300 hover:cursor-pointer hover:bg-hover hover:text-primary "
        >
          Achievements
        </button>

        <div className="mx-4 my-auto grid grid-cols-2 flex-col gap-8 py-2">
          <div className="my-4 flex items-center justify-center">
            <Image
              src={
                searchByType(user.achievements, "LONGEVITY").done === true ? unlockedAch1 : lockedAch1
              }
              alt="LONGEVITY"
              className="h-28 w-28 rounded"
            />
          </div>
          <div className="my-4 flex items-center justify-center">
            <Image
              src={
                searchByType(user.achievements, "STRATEGIC").done === true ? unlockedAch2 : lockedAch2
              }
              alt="STRATEGIC"
              className="h-28 w-28 rounded"
            />
          </div>
          <div className="my-4 flex items-center justify-center">
            <Image
              src={
                searchByType(user.achievements, "PRODIGY").done === true ? unlockedAch3 : lockedAch3
              }
              alt="PRODIGY"
              className="h-28 w-28 rounded"
            />
          </div>

          <div className="my-4 flex items-center justify-center">
            <Image
              src={
                searchByType(user.achievements, "GOLDEN").done === true ? unlockedAch4 : lockedAch4
              }
              alt="GOLDEN"
              className="h-28 w-28 rounded"
            />
          </div>

          <div className="my-4 flex items-center justify-center">
            <Image
              src={
                searchByType(user.achievements, "COMEBACK").done === true ? unlockedAch5 : lockedAch5
              }
              alt="COMEBACK"
              className="h-28 w-28 rounded"
            />
          </div>
          <div className="my-4 flex items-center justify-center">
            <Image
              src={
                searchByType(user.achievements, "RALLY").done === true ? unlockedAch6 : lockedAch6
              }
              alt="RALLY"
              className="h-28 w-28 rounded"
            />
          </div>

          <div className="my-4 flex items-center justify-center">
            <Image
              src={
                searchByType(user.achievements, "MASTER").done === true ? unlockedAch7 : lockedAch7
              }
              alt="MASTER"
              className="h-28 w-28 rounded"
            />
          </div>
          <div className="my-4 flex items-center justify-center">
            <Image
              src={
                searchByType(user.achievements, "CHALLENGER").done === true ? unlockedAch8 : lockedAch8
              }
              alt="CHALLENGER"
              className="h-28 w-28 rounded"
            />
          </div>
        </div>
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-1/2 overflow-hidden rounded-xl bg-background p-4 ">
            <div className="h-[50px] w-full border-b text-left font-vietnam font-bold text-white hover:cursor-pointer ">
              Achievements
              <button
                onClick={closeModal}
                type="button"
                className="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-primary hover:text-white "
                data-modal-hide="default-modal"
              >
                <svg
                  className="h-3 w-3"
                  aria-hidden="true"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
            </div>

            <div className="mx-4 grid grid-cols-2 flex-col gap-4">
              <div className="my-4 flex items-center justify-center hover:bg-hr">
              <Image
              src={
                searchByType(user.achievements, "LONGEVITY").done === true ? unlockedAch1 : lockedAch1
              }
              alt="LONGEVITY"
              className="h-28 w-28 rounded"
            />
                <div className="ml-4 font-vietnam text-white">
                  <h3 className="mb-1 text-[15px] font-normal">
                    {" "}
                    Longevity Award
                  </h3>
                  <h3 className="mb-1 text-[10px] font-normal">
                    {" "}
                    Achieve a winning streak of 5 games in a row, proving your
                    consistency and skill on the table, and earning 20 XP as a
                    Ping Pong Prodigy.
                  </h3>
                </div>
              </div>

              <div className="my-4 flex items-center justify-center hover:bg-hr">
              <Image
              src={
                searchByType(user.achievements, "STRATEGIC").done === true ? unlockedAch2 : lockedAch2
              }
              alt="STRATEGIC"
              className="h-28 w-28 rounded"
            />
                <div className="ml-4 font-vietnam text-white">
                  <h3 className="mb-1 text-[15px] font-normal">
                    {" "}
                    Strategic Server
                  </h3>
                  <h3 className="mb-1 text-[10px] font-normal">
                    {" "}
                    Win a match by focusing solely on strategic serves, catching
                    your opponent off guard and earning 40 XP as the Strategic
                    Server.
                  </h3>
                </div>
              </div>
              <div className="my-4 flex items-center justify-center hover:bg-hr">
              <Image
              src={
                searchByType(user.achievements, "PRODIGY").done === true ? unlockedAch3 : lockedAch3
              }
              alt="PRODIGY"
              className="h-28 w-28 rounded"
            />
                <div className="ml-4 font-vietnam text-white">
                  <h3 className="mb-1 text-[15px] font-normal">
                    {" "}
                    Ping Pong Prodigy
                  </h3>
                  <h3 className="mb-1 text-[10px] font-normal">
                    {" "}
                    Achieve a winning streak of 10 games in a row, proving your
                    consistency and skill on the table, and earning 50 XP as a
                    Ping Pong Prodigy.
                  </h3>
                </div>
              </div>

              <div className="my-4 flex items-center justify-center hover:bg-hr">
              <Image
              src={
                searchByType(user.achievements, "GOLDEN").done === true ? unlockedAch4 : lockedAch4
              }
              alt="GOLDEN"
              className="h-28 w-28 rounded"
            />
                <div className="ml-4 font-vietnam text-white">
                  <h3 className="mb-1 text-[15px] font-normal">
                    {" "}
                    Golden Paddle
                  </h3>
                  <h3 className="mb-1 text-[10px] font-normal">
                    {" "}
                    Accumulate 1000 XP in total, unlocking the prestigious
                    Golden Paddle badge to showcase your dedication and mastery
                    of the game on our Ping Pong website. + 60 XP
                  </h3>
                </div>
              </div>

              <div className="my-4 flex items-center justify-center hover:bg-hr">
              <Image
              src={
                searchByType(user.achievements, "COMEBACK").done === true ? unlockedAch5 : lockedAch5
              }
              alt="COMEBACK"
              className="h-28 w-28 rounded"
            />
                <div className="ml-4 font-vietnam text-white">
                  <h3 className="mb-1 text-[15px] font-normal">
                    {" "}
                    Longevity The Comeback King
                  </h3>
                  <h3 className="mb-1 text-[10px] font-normal">
                    {" "}
                    Stage an impressive comeback from a 5-point deficit to win
                    the match, demonstrating your resilience and earning 20 XP
                    as the indomitable Comeback King.
                  </h3>
                </div>
              </div>
              <div className="my-4 flex items-center justify-center hover:bg-hr">
              <Image
              src={
                searchByType(user.achievements, "RALLY").done === true ? unlockedAch6 : lockedAch6
              }
              alt="RALLY"
              className="h-28 w-28 rounded"
            />
                <div className="ml-4 font-vietnam text-white">
                  <h3 className="mb-1 text-[15px] font-normal">
                    {" "}
                    Rally Maestro
                  </h3>
                  <h3 className="mb-1 text-[10px] font-normal">
                    Engage in a rally of 25 wins to showcase your remarkable
                    control and precision, earning 80 XP as you dominate the
                    table.{" "}
                  </h3>
                </div>
              </div>

              <div className="my-4 flex items-center justify-center hover:bg-hr">
              <Image
              src={
                searchByType(user.achievements, "MASTER").done === true ? unlockedAch7 : lockedAch7
              }
              alt="MASTER"
              className="h-28 w-28 rounded"
            />
                <div className="ml-4 font-vietnam text-white">
                  <h3 className="mb-1 text-[15px] font-normal">
                    {" "}
                    Table Master
                  </h3>
                  <h3 className="mb-1 text-[10px] font-normal">
                    {" "}
                    Achieve a flawless victory with a score of 5-0, showcasing
                    your dominance and skill at the table, and earning a
                    substantial 90 XP bonus as the undisputed Table Master.
                  </h3>
                </div>
              </div>
              <div className="my-4 flex items-center justify-center hover:bg-hr">
              <Image
              src={
                searchByType(user.achievements, "CHALLENGER").done === true ? unlockedAch8 : lockedAch8
              }
              alt="CHALLENGER"
              className="h-28 w-28 rounded"
            />
                <div className="ml-4 font-vietnam text-white">
                  <h3 className="mb-1 text-[15px] font-normal">
                    {" "}
                    Consistent Challenger
                  </h3>
                  <h3 className="mb-1 text-[10px] font-normal">
                    {" "}
                    Engage in a rally of 50 wins to showcase your remarkable
                    control and precision, earning 150 XP as you dominate the
                    game.
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
