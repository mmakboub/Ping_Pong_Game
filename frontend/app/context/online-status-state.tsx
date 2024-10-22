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
  status: { userId: string; status: string }[];
  setStatus: Dispatch<SetStateAction<{ userId: string; status: string }[]>>;
}

export const OnlineStatusContext = createContext<ContextProps>({
  status: [],
  setStatus: () => {},
});

export const OnlineStateProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<{ userId: string; status: string }[]>(
    []
  );
  return (
    <OnlineStatusContext.Provider
      value={{
        status,
        setStatus,
      }}
    >
      {children}
    </OnlineStatusContext.Provider>
  );
};

export const useOnlineStatusContext = () => useContext(OnlineStatusContext);
