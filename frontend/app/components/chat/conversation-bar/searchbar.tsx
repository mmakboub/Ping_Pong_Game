"use client";
import { use, useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import Image from "next/image";
import { useRouter } from "next/navigation";
import chatService from "@/app/chat/services/chat-service";
import { CanceledError } from "axios";
import { useGlobalUserContext } from "@/app/context/UserDataContext";

type Rooms = {
  name: string;
  pictureUrl: string;
  id: string;
};

let rooms: Rooms[] = [];

export default function SearchBar() {
  const [activeSearch, setActiveSearch] = useState<Rooms[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(false);
  const router = useRouter();

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setActiveSearch([]);
      return false;
    }
    setActiveSearch(
      rooms.filter((room) => room.name.includes(e.target.value)).slice(0, 10)
    );
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const searchBar = document.getElementById("search-bar");
      if (searchBar && !searchBar.contains(event.target as Node)) {
        setActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const fetchUsers = () => {
    const { request, cancel } = chatService.getAll<Rooms>("enabled-room/");
    request
      .then((res) => {
        rooms = res.data;
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

  const checkRoom = (roomId: string) => {
    router.push("/chat/rooms/" + roomId);
  };
  return (
    <form
      className="relative w-full rounded-2xl bg-hover py-1"
      onClick={fetchUsers}
      onSubmit={(e) => e.preventDefault()}
    >
      <div className=" flex w-full items-center gap-3 p-2 text-fill">
        <button>
          <IoSearchSharp className="h-moreIcon w-moreIcon " />
        </button>
        <input
          type="search"
          onChange={(e) => onSearch(e)}
          className="ml-3 w-full bg-hover bg-opacity-0 font-vietnam text-sm font-semibold tracking-wide text-fill placeholder-fill  focus:text-white focus:outline-none"
          placeholder="Search for rooms ..."
          onClick={() => setActive(true)}
        />
      </div>
      {activeSearch.length > 0 && active && (
        <div
          id="search-bar"
          className="absolute  top-[100%] z-[30] flex  w-full flex-col gap-2 rounded-xl bg-[#2A2A2A] p-4 text-white"
        >
          <div className="mb-2 h-[40px] border-b-2 font-BeVietnamPro font-extrabold">
            Rooms
          </div>
          {activeSearch.map((room, index) => (
            <div
              key={index}
              className="mb-2 flex items-center gap-3 rounded-xl px-2 py-1 hover:cursor-pointer hover:bg-hover"
              onClick={() => checkRoom(room.id)}
            >
              <div>
                <Image
                  src={room.pictureUrl}
                  alt="user picture"
                  className="rounded-full border-[0.5px] border-white"
                  width={25}
                  height={25}
                />
              </div>
              <div className="px-2 py-1 text-center font-BeVietnamPro ">
                {room.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </form>
  );
}
