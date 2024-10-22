import React, { useEffect } from "react";
import { useRouter } from "next/router";

const NotFound = () => {
  return (
    <div className="relative z-[1] flex h-full w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-xl bg-chatBackground">
      <p className="font-BeVietnamPro text-[100px] font-extrabold text-primary">
        404
      </p>
      <p className="text-[50px] font-bold text-white">you are in the nowhere</p>
    </div>
  );
};

export default NotFound;
