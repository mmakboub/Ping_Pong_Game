import Link from "next/link";
import React from "react";

const PlayGameButton = () => {
  return (
    <Link href={"/game"}>
      <div className="flex items-end pb-4 pl-3">
        <button className="box-shadow-md h-9 w-28 rounded-lg bg-gradient-to-r from-red-600 via-pink-700 to-purple-800 text-center font-vietnam  text-[15px] font-medium text-white">
          play game
        </button>
      </div>
    </Link>
  );
};

export default PlayGameButton;
