import React from "react";

const Loading = () => {
  return (
    <div className="relative flex w-2/3  items-center justify-center rounded-xl bg-[#2F2F2F]">
      <div className="flex">
        <div className="mr-4 h-5 w-5 animate-ping rounded-full bg-primary"></div>
        <div className="mr-4 h-5 w-5 animate-ping rounded-full bg-primary"></div>
        <div className="h-5 w-5 animate-ping rounded-full bg-primary"></div>
      </div>
    </div>
  );
};

export default Loading;
