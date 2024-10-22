"use client";
import { useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CanceledError } from "axios";
import profile_service from "@/app/profile/service/profile";
import { User } from "@/app/dtos/user.dto";
import { set } from "zod";

interface Props {
  username: string;
}

let friends: User[] = [];

export default function SearchBar({ username }: Props) {
  const [activeSearch, setActiveSearch] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setActiveSearch([]);
      return false;
    }
    setActiveSearch(
      friends
        .filter((friend) => friend.username.includes(e.target.value))
        .slice(0, 10)
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
  const fetchFriends = (username: string) => {
    try {
      const { request, cancel } = profile_service.getOne<User>(
        "user/friends/",
        username
      );
      request
        .then((res) => {
          setActiveSearch(res.data.friends);
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
  const checkProfile = (username: string) => {
    router.push("/profile/" + username);
  };
  return (
    <form
      className="relative w-full rounded-2xl bg-hover py-1"
      onClick={() => fetchFriends(username)}
      onSubmit={(e) => e.preventDefault()}
    >
      <div className=" flex w-full items-center gap-3 p-2 text-fill">
        <button>
          <IoSearchSharp className="h-moreIcon w-moreIcon " />
        </button>
        <input
          type="search"
          onChange={(e) => onSearch(e)}
          onFocus={() => setActive(true)} // Trigger setActive(true) when the input gains focus
          className="ml-3 w-full bg-hover bg-opacity-0 font-vietnam text-sm font-semibold tracking-wide text-fill placeholder-fill  focus:text-white focus:outline-none"
          placeholder="Search for friends ..."
        />
      </div>
      {activeSearch.length > 0 && active && (
        <div
          id="search-bar"
          className="absolute  top-[100%] z-[30] flex  w-full flex-col gap-2 rounded-xl bg-[#2A2A2A] p-4 text-white"
        >
          <div className="mb-2 h-[40px] border-b-2 font-BeVietnamPro font-extrabold">
            Friend
          </div>
          {activeSearch.map((friend, index) => (
            <div
              key={index}
              className="mb-2 flex items-center gap-3 rounded-xl px-2 py-1 hover:cursor-pointer hover:bg-hover"
              onClick={() => checkProfile(friend.username)}
            >
              <div>
                <Image
                  src={friend.pictureUrl}
                  alt="user picture"
                  className="rounded-full border-[0.5px] border-white"
                  width={25}
                  height={25}
                />
              </div>
              <div className="px-2 py-1 text-center font-BeVietnamPro ">
                {friend.username}
              </div>
            </div>
          ))}
        </div>
      )}
    </form>
  );
}
