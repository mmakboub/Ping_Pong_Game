"use client";
import {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
  ReactNode,
} from "react";

interface ContextProps {
  render: boolean;
  setRender: Dispatch<SetStateAction<boolean>>;
}

export const GlobalMsgContext = createContext<ContextProps>({
  render: false,
  setRender: () => {},
});

export const GlobalMsgProvider = ({ children }: { children: ReactNode }) => {
  const [render, setRender] = useState<boolean>(false);
  return (
    <GlobalMsgContext.Provider
      value={{
        render,
        setRender,
      }}
    >
      {children}
    </GlobalMsgContext.Provider>
  );
};

export const useGlobalMsgContext = () => useContext(GlobalMsgContext);
