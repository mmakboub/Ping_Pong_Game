"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
//import { authenticateWith42 } from './authService';
function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <div className="flex p-28 items-center justify-center  rounded-[20px] bg-[#383838] shadow-md shadow-[#242424]">
      <div className="flex p-16 flex-col gap-16 items-center  justify-evenly rounded-[20px] border-2  border-[#646464] bg-[#383838] ">
        <h1 className=" text-center font-vietnam text-5xl font-bold text-white ">
          {" "}
          Welcome back
        </h1>
        <button
          onClick={
            () => {
              setLoading(true);
              router.push(`${process.env.NEXT_PUBLIC_API_URL}:4000/auth`)
            }}
          type="button"
          className=" flex items-center h-[80px] w-[200px] justify-center rounded-[20px] bg-[#383838] border-[#404040] border hover:bg-[#363636] font-vietnam text-3xl font-bold text-[#CD4D4D] hover:shadow-md hover:shadow-[#242424]  "
        >
          {
            loading ? (
              <div className="w-[40px] h-[40px] border-t-2 animate-spin border-[#878787] rounded-full"></div>
            ) : (
              <>
                < svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="35"
                  height="30"
                  viewBox="0 0 29 24"
                  fill="none"
                  className="mr-2 mt-1"
                >
                  <path
                    d="M8.76955 0.3125H12.6675L4.7236 10.067H14.5918V18.6532H10.0524V13.63H0.875V10.067L8.76955 0.3125Z"
                    fill="#CD4D4D"
                  />
                  <path
                    d="M19.0869 0.3125H24.0383L21.5626 3.53496L19.0869 6.75742V0.3125Z"
                    fill="#CD4D4D"
                  />
                  <path
                    d="M28.9348 18.4884L23.9625 18.4846L26.4472 15.2523L28.9318 11.9327L28.9348 18.4884Z"
                    fill="#CD4D4D"
                  />
                  <path
                    d="M24.0383 0.3125H28.9897L28.9322 6.78573L24.0383 12.5969V18.4817H19.0869V12.5969L24.0383 6.63861V0.3125Z"
                    fill="#CD4D4D"
                  />
                </svg>
                Login
              </>

            )
          }
        </button>
      </div>
    </div>
  );
}

export default Login;
