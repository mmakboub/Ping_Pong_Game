import React from "react";

const NotFound = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-black">
      {/* chat header */}
      <p className="font-BeVietnamPro text-[100px] font-extrabold text-primary">
        404
      </p>
      <p className="text-[50px] font-bold text-white">page not found</p>
    </div>
  );
};

export default NotFound;
