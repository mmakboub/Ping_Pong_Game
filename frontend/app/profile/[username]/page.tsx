"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/Header/Header";
import UserInfo from "../components/UserInfo/UserInfo";
import Search from "../components/Search/Search";
import Friends from "../components/Friends/Friends";
import Historique from "../components/Historique/Historique";
import Card from "../components/Card/Card";
import Achievement from "../components/Achievement/Achievement";
import { User } from "@/app/dtos/user.dto";
import { ParsedUrlQuery } from "querystring";
import profileService from "../service/profile";
import { CanceledError } from "axios";
import { useGlobalUserContext } from "@/app/context/UserDataContext";
import profile_service from "@/app/profile/service/profile";
import notFound from "./not-found";
import Wrapper from "@/app/components/Wrapper/Wrapper";

export default function Profile({ params }: { params: ParsedUrlQuery }) {
  const { userData } = useGlobalUserContext();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const { request, cancel } = profile_service.getOne<User>(
        "user/",
        params.username as string
      );
      request
        .then((res) => {
          setUser(res.data);
          setLoading(false);
        })
        .catch((err) => {
          if (err instanceof CanceledError) return;
          setError(err.message);
          setLoading(false);
        });
      return () => {
        cancel();
      };
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [params.username]);

  // if (!user) {
  //   return <div>user not found</div>;
  // }

  if (!user && !loading) return notFound();
  return (
    <>
      <Wrapper>
        <div className="flex h-screen w-full flex-col gap-5 overflow-y-auto bg-pageBackground  md:flex-row">
          <div className="flex h-full w-full flex-col gap-4 rounded-xl  md:w-3/4 ">
            <UserInfo username={params.username as string} />

            <div className="flex h-full w-full flex-col  gap-4 rounded-xl md:flex-row">
              <div className=" overflow-hidden rounded-xl md:w-1/3">
                <Friends username={params.username as string} />
              </div>

              <Historique username={params.username as string} />
            </div>
          </div>

          <div className="flex w-full flex-col gap-5 md:w-1/4 ">
            <Card username={params.username as string} />
            <Achievement username={params.username as string} />
          </div>
        </div>
      </Wrapper>
    </>
  );
}
