import { User } from "@/app/dtos/user.dto";
import avatar from "@/app/public/images/avatars/avatar.jpeg";
import Image from "next/image";
import { useEffect, useState } from "react";
import profile_service from "@/app/profile/service/profile";
import { CanceledError } from "axios";
import Link from "next/link";
import { History } from "@/app/dtos/history.dto";
import { FaHistory } from "react-icons/fa";

interface Props {
  username: string;
}

export default function Historique({ username }: Props) {
  const [historique, setHistorique] = useState<History[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchUserData = (username: string) => {
      try {
        const { request, cancel } = profile_service.getAllFor<History>(
          "user/historique/",
          username
        );
        request
          .then((res) => {
            setHistorique(res.data);
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
  if (!historique) {
    return <></>;
  }

  return (
    <>
      <div className="flex h-full flex-col overflow-hidden rounded-xl bg-background md:w-1/3 lg:w-2/3 ">
        <div className="w-full border-b-2 border-fill p-4 font-vietnam font-bold  text-white ">
          History
        </div>

        {historique.length === 0 ? (
          <div className="flex flex-grow flex-col items-center justify-center bg-[#2F2F2F] text-center font-BeVietnamPro text-[180px] font-extrabold text-primary">
            <div className="flex h-[60%] items-center justify-center">
              <FaHistory />
            </div>
            <div className="flex h-[40%] items-start justify-center">
              <p className=" w-[70%] text-[25px] font-bold text-white">
                No historical records available.
              </p>
            </div>
          </div>
        ) : (
          <div className="h-[500px] overflow-y-auto">
            {historique.map((history, index) => (
              <div
                key={index}
                className={`flex w-full flex-col-reverse  ${
                  index % 2 === 0 ? "bg-hover bg-opacity-30" : "bg-background"
                }`}
              >
                <div className="my-4 flex justify-center gap-4 ">
                  {/* playerwin */}
                  <div className="flex w-[40%] justify-end gap-8">
                    <div className="flex w-[70%] flex-col justify-around font-vietnam text-white">
                      <div className="mb-1  flex justify-end text-[15px] font-bold text-white">
                        {history.usernameWin}
                      </div>
                      <div className="flex justify-end  text-[12px] font-bold text-fill ">
                        Level {Math.floor(history.playerWin.xp / 250)}
                      </div>
                    </div>
                    <div className="flex h-[60px] w-[60px]">
                      <Image
                        src={history.playerWin.pictureUrl}
                        alt="Picture of the author"
                        className="h-full w-full rounded-xl object-cover"
                        width={100}
                        height={100}
                      />
                    </div>
                  </div>
                  {/* Date */}
                  <div className="flex w-[20%] flex-col items-center ">
                    <div className="flex flex-col justify-around font-vietnam text-white">
                      <div
                        className={` flex gap-6 text-[25px] font-extrabold ${username === history.usernameLose ? "text-[#ff0000]" : "text-onlineStatus"}`}
                      >
                        <div>{history.winScore}</div>
                        <div>---</div>
                        <div>{history.loseScore}</div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-around font-vietnam text-white">
                      <h3 className="mb-1 text-[10px] font-bold text-fill">
                        {history.date.slice(0, 10)}
                      </h3>
                    </div>
                  </div>
                  {/* playerlose */}
                  <div className="flex w-[40%] gap-8">
                    <div className="flex h-[60px] w-[60px]">
                      <Image
                        src={history.playerLose.pictureUrl}
                        alt="Picture of the author"
                        className="h-full w-full rounded-xl object-cover"
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className="flex flex-col justify-around font-vietnam text-white">
                      <h3 className="mb-1 text-[15px] font-bold text-white">
                        {history.usernameLose}
                      </h3>
                      <h6 className="flex text-[12px] font-bold text-fill ">
                        Level {Math.floor(history.playerLose.xp / 250)}
                      </h6>
                    </div>
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
