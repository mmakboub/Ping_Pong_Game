import Image from "next/image";
import level0 from "@/public/images/levels/level0.png";
import level1 from "@/public/images/levels/level1.png";
import level2 from "@/public/images/levels/level2.png";
import level3 from "@/public/images/levels/level3.png";
import level4 from "@/public/images/levels/level4.png";
import level5 from "@/public/images/levels/level5.png";
import level6 from "@/public/images/levels/level6.png";
import level7 from "@/public/images/levels/level7.png";
import level8 from "@/public/images/levels/level8.png";

import { useEffect, useState } from "react";
import { useGlobalUserContext } from "@/app/context/UserDataContext";
import { User } from "@/app/dtos/user.dto";
import { CanceledError } from "axios";
import profile_service from "@/app/profile/service/profile";

interface Props {
  username: string;
}
export default function Card({ username }: Props) {
  const { userData } = useGlobalUserContext();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchUserData = (username: string) => {
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
    };

    if (username === userData.username) {
      setUser(userData);
    } else {
      fetchUserData(username);
    }
  }, [username, userData]);

  if (!user) {
    return <></>;
  }
  const { firstname, lastname, rank } = user;

  // Calculate the current level based on user's XP
  let currentLevel = Math.floor(user.xp / 250);
  if (currentLevel > 8) {
    currentLevel = 8;
  }

  // Calculate the XP required for the next level
  const xpForNextLevel = currentLevel * 250;

  // Calculate the progress within the current level
  const xpProgress = user.xp % 250;
  const progressPercentage = (xpProgress / 250) * 100;

  const levelImageSrc = [
    `https://res.cloudinary.com/dafjoc7f3/image/upload/v1708903731/ruxqrkalpslr4texhvvz.png `,
    `https://res.cloudinary.com/dafjoc7f3/image/upload/v1708903731/jl3bzxhddwe0qh1h4xpz.png `,
    `https://res.cloudinary.com/dafjoc7f3/image/upload/v1708903730/hmpzdilbstl3lxaqwsat.png`,
    `https://res.cloudinary.com/dafjoc7f3/image/upload/v1708903730/ydx5domjwbeawkn0r5nv.png`,
    `https://res.cloudinary.com/dafjoc7f3/image/upload/v1708903731/bspzjvfpjrvux4sedgy8.png`,
    `https://res.cloudinary.com/dafjoc7f3/image/upload/v1708903730/uz9mz4av9dbbmxeqp3pg.png`,
    `https://res.cloudinary.com/dafjoc7f3/image/upload/v1708903731/gtxnlss5imwqjo73fwb7.png`,
    `https://res.cloudinary.com/dafjoc7f3/image/upload/v1708903219/zbcueqnmpdjr4dkcranj.png`,
    `https://res.cloudinary.com/dafjoc7f3/image/upload/v1708903708/givdcqm7pdvt2c4vosou.png`,
  ];

  // Determine the color based on the current level
  const levelColors = [
    "#6356BEff",
    "#9160B0ff",
    "#B05995ff",
    "#CF527Bff",
    "#F2654Fff",
    "#F36B55ff",
    "#F48848ff",
    "#AE7123ff",
    "rgba(243, 200, 83, 1)",
  ];
  const progressBarColor = levelColors[currentLevel];

  return (
    <div className="flex h-1/3 w-full flex-col rounded-xl bg-background">
      <div className="relative h-1/3">
        <div className="absolute top-[-25%] flex w-full flex-col items-center justify-center">
          <Image
            src={levelImageSrc[currentLevel]}
            alt={`level${currentLevel}`}
            width={70}
            height={70}
            className="w-18 h-"
          />
          <h3 className="pl-2 text-center font-bold tracking-wide text-fill">
            Level {currentLevel}
          </h3>
        </div>
      </div>
      {currentLevel < 8 && (
        <div className="w-3/4 self-center">
          <div className="mb-2 flex justify-between">
            <div className="text-extrabold font-BeVietnamPro text-xs text-white">
              Next Level
            </div>
            <div className="text-extrabold font-BeVietnamPro text-xs text-white">
              {user.xp - xpForNextLevel} / 250 xp
            </div>
          </div>
          <div className="h-2.5 w-full  rounded-full bg-black">
            <div
              className="h-2.5 rounded-full"
              style={{
                width: `${progressPercentage}%`,
                background: progressBarColor,
              }}
            ></div>
          </div>
        </div>
      )}
      <div className="mt-14 flex w-full justify-between self-center px-4 font-bold text-white">
        <div className="flex w-1/3 flex-col text-center">
          <h3 className="mb-2 text-sm">matches</h3>
          <div className="h-full border-r-2 border-primary p-2 text-lg">
            {user.matchPlayed}
          </div>
        </div>
        <div className="flex w-1/3 flex-col text-center">
          <h3 className="mb-2 text-sm">win</h3>
          <div className="h-full border-r-2 border-primary p-2 text-lg">
            {user.matchWon}
          </div>
        </div>
        <div className="flex w-1/3 flex-col text-center">
          <h3 className="mb-2 text-sm">lose</h3>
          <div className="h-full p-2 text-lg">{user.matchLost}</div>
        </div>
      </div>
    </div>
  );
}
