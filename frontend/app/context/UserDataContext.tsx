"use client";
import {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
  ReactNode,
  useEffect,
} from "react";
import userService from "@/app/services/user-service";
import { CanceledError } from "axios";
import { User } from "@/app/dtos/user.dto";
import { GlobalWebSocketContext } from "./GlobalSocket";
import { Slide, toast } from "react-toastify";
import { useGlobalRenderNotifContext } from "./renderNotif";
import { GlobalOnlineSocketContext } from "./online-status";
import Wrapper from "../components/Wrapper/Wrapper";
interface ContextProps {
  userData: User;
  setUserData: Dispatch<SetStateAction<User>>;
  UserLoading: boolean;
  setUserLoading: Dispatch<SetStateAction<boolean>>;
}

export const GlobalContext = createContext<ContextProps>({
  userData: {
    id: "",
    username: "",
    firstname: "",
    lastname: "",
    pictureUrl: "",
    matchLost: 0,
    matchPlayed: 0,
    matchWon: 0,
    level: 0,
    rank: 0,
    isOnline: "",
    friends: [],
    twoFactor: false,
    xp: 0,
    achievements: [],
    isfirsttime: true,
  },
  setUserData: () => {},
  UserLoading: true,
  setUserLoading: () => {},
});

export const GlobalContextUserProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [error, setError] = useState("");
  const [UserLoading, setUserLoading] = useState(true);
  const globalsocket = useContext(GlobalWebSocketContext);
  const { renderNotif, setRenderNotif } = useGlobalRenderNotifContext();
  const onlineSocket = useContext(GlobalOnlineSocketContext);
  const [userData, setUserData] = useState<User>({
    id: "",
    username: "",
    firstname: "",
    lastname: "",
    pictureUrl: "",
    matchLost: 0,
    matchPlayed: 0,
    matchWon: 0,
    level: 0,
    xp: 0,
    rank: 0,
    isOnline: "",
    friends: [],
    twoFactor: false,
    isfirsttime: true,
    achievements: [],
  });

  useEffect(() => {
    const { request, cancel } = userService.getUser<User>();
    request
      .then((res) => {
        setUserData(res.data);
        setUserLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setUserLoading(true);
      });
    return () => {
      cancel();
    };
  }, []);

  useEffect(() => {
    if (!onlineSocket.connected && userData.id !== "") {
      onlineSocket.connect();
      onlineSocket.on("connect", () => {
        onlineSocket.emit("newConnection", userData.id);
      });
      onlineSocket.on("error", (error) => {
        console.error("global socket connection error:", error);
      });
    }
    return () => {
      onlineSocket.off("connect");
      onlineSocket.off("error");
    };
  }, [userData, onlineSocket]);

  useEffect(() => {
    if (!globalsocket.connected && userData.id !== "") {
      globalsocket.connect();
      globalsocket.on("connect", () => {
        globalsocket.emit("newConnection", userData.id);
      });
      globalsocket.on("error", (error) => {
        console.error("global socket connection error:", error);
      });
      globalsocket.on("AcceptedNotif", (senderId: string) => {
        const notify = () =>
          toast.success(`${senderId} accepted your friend request !`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            transition: Slide,
          });
        setRenderNotif((prev) => !prev);
        notify();
      });
      globalsocket.on("GotNewFriendRequest", (senderId: string) => {
        const notify = () =>
          toast.info(`${senderId} sent you a friend request !`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            transition: Slide,
          });
        setRenderNotif((prev) => !prev);
        notify();
      });
    }
    return () => {
      globalsocket.off("connect");
      globalsocket.off("GotNewFriendRequest");
      globalsocket.off("friendRequestCanceld");
      globalsocket.off("AcceptedNotif");
      globalsocket.off("newFriendRoom");
      globalsocket.off("error");
      globalsocket.disconnect();
    };
  }, [userData, globalsocket, setRenderNotif]);
  return (
    <GlobalContext.Provider
      value={{
        userData,
        setUserData: setUserData,
        UserLoading,
        setUserLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalUserContext = () => useContext(GlobalContext);
