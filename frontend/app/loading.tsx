import React from "react";

const Loading = () => {
  return (
    <div className="relative z-[1] flex w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-xl bg-chatBackground">
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-4 border-primary"></div>
      </div>
    </div>
  );
};

export default Loading;
