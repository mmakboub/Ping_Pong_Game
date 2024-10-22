"use client";
import { User } from "@/app/dtos/user.dto";
import userService from "@/app/services/user-service";
import { CanceledError } from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Wrappertfa({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuth, setIsAuth] = useState(false);

  const router = useRouter();
  useEffect(() => {
    const { request } = userService.getUser<User>();
    request
      .then((res) => {
        if (res.data) router.push("/profile");
      })
      .catch((err) => {
        setIsAuth(true);
      });
  }, [router]);
  if (isAuth) return children;
  return null;
}
