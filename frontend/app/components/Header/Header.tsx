"use client";
import styles from "./Header.module.css";
import SearchBar from "@/app/components/SearchBar/SearchBar";
import Image from "next/image";
import { VscTriangleDown } from "react-icons/vsc";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useGlobalUserContext } from "@/app/context/UserDataContext";
import Notification from "@/app/components/Notification/notification";
function Header() {
  const [moreButton, setmoreButton] = useState(false);
  const { userData } = useGlobalUserContext();
  const handleClickMore = () => {
    setmoreButton(true);
  };

  useEffect(() => {
    let handler = () => {
      setmoreButton(false);
    };

    document.addEventListener("mousedown", handler);
  });
  if (userData.id === "") return <></>;
  return (
    <div className=" relative flex h-16 w-full items-center justify-between border-b border-hr pl-3 text-white">
      <div
        className={`absolute right-[20px] top-16 z-10 h-[120px] w-[200px] rounded-2xl bg-hr ${moreButton ? styles.active : styles.inactive}
            before:absolute before:right-[20px] before:top-[-5px] before:h-[20px] before:w-[20px] before:rotate-45 before:bg-hr`}
      >
        <Link
          href="/profile"
          className="group flex h-1/2 w-full gap-3 text-[15px] font-bold text-white duration-300
                  hover:rounded-t-2xl hover:text-primary"
        >
          <span className="z-11 mx-5 h-full w-full border-b px-2 pt-4 text-start">
            Profile
          </span>
        </Link>

        <Link
          href="/setting"
          className="flex h-1/2 w-full gap-3 text-[15px] font-bold text-white duration-300
                  hover:text-primary"
        >
          <span className="z-11 mx-5 h-full w-full px-2 pt-4 text-start">
            Setting
          </span>
        </Link>
      </div>
      <SearchBar />
      <div className="flex h-full w-[300px] items-center justify-between">
        <Notification />
        <div className="flex h-full w-[230px] items-center justify-around bg-background">
          <div className="h-[48px] w-[48px] ">
            <Image
              src={userData.pictureUrl}
              alt="Picture of the author"
              className="h-full w-full rounded-lg object-cover"
              width={100}
              height={100}
              priority
            />
          </div>
          <Link
            href="/profile"
            className="font-vietnam font-semibold hover:cursor-pointer hover:text-primary"
          >
            {userData.username}
          </Link>
          <VscTriangleDown
            className=" h-moreIcon w-moreIcon rounded hover:cursor-pointer hover:bg-hover"
            onClick={handleClickMore}
          />
        </div>
      </div>
    </div>
  );
}

export default Header;
