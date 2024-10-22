import React from "react";

interface Props {
  children: string;
  state: boolean;
  handleClick: () => void;
}

const ConversationButton = ({ children, handleClick, state }: Props) => {
  return (
    <button
      className={`h-[75px] w-full border-b border-hr bg-hover
               font-vietnam font-bold text-white duration-300 hover:cursor-pointer 
               ${state ? "bg-primary" : "bg-hover hover:text-primary"}`}
      onClick={() => handleClick()}
    >
      {children}
    </button>
  );
};

export default ConversationButton;
