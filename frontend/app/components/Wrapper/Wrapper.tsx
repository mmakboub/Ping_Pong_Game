"use client";
import { User } from "@/app/dtos/user.dto";
import userService from "@/app/services/user-service";
import { CanceledError } from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Wrapper({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState(false);

  const router = useRouter();
  useEffect(() => {
    const { request } = userService.getUser<User>();
    request
      .then((res) => {
        setIsAuth(true);
      })
      .catch((err) => {
        router.push("/auth");
      });
    return () => {};
  }, [router]);
  if (isAuth) return children;
  return null;
}
