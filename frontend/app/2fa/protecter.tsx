import React, { ReactNode, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "../services/api-client";
import Wrapper from "../components/Wrapper/Wrapper";

const PostIsActivate = async () => {
  try {
    const res = await apiClient.post("/tfa/isactive");
    return res.data.success;
  } catch (error) {
    console.error("Error checking 2FA activation:", error);
    throw error;
  }
};

export default function IsActivate({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const checkActivation = async () => {
      try {
        const isActive = await PostIsActivate();
        if (isActive) {
          router.push("/2fa")
        } else {
          router.push("/home");
        }
      } catch (err) {
        router.push("/home");
      }
    };

    checkActivation();
  }, [router]);

  return <Wrapper>{children}</Wrapper>;
}
