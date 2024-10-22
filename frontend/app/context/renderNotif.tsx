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
  renderNotif: boolean;
  setRenderNotif: Dispatch<SetStateAction<boolean>>;
}

export const GlobalRenderNotifContext = createContext<ContextProps>({
  renderNotif: false,
  setRenderNotif: () => {},
});

export const GlobalRenderNotifProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [renderNotif, setRenderNotif] = useState<boolean>(false);
  return (
    <GlobalRenderNotifContext.Provider
      value={{
        renderNotif,
        setRenderNotif,
      }}
    >
      {children}
    </GlobalRenderNotifContext.Provider>
  );
};

export const useGlobalRenderNotifContext = () =>
  useContext(GlobalRenderNotifContext);
