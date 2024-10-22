import React, { useEffect } from "react";

const NotFound = () => {
  return (
    <div className="relative z-[1] flex w-2/3 flex-col items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#2F2F2F]">
      <p className="font-BeVietnamPro text-[100px] font-extrabold text-primary">
        404
      </p>
      <p className="text-[50px] font-bold text-white">you are in the nowhere</p>
    </div>
  );
};

export default NotFound;
