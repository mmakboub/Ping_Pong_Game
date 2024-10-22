"use client";
import { useRouter } from 'next/navigation';
import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import apiClient, { CanceledError } from "@/app/services/api-client";
import Asset from "../auth/components/Asset";
import userService from '../services/user-service';
import { useGlobalUserContext } from '../context/UserDataContext';
import { User } from '../dtos/user.dto';
import Wrappertfa from '../components/Wrapper/wrapper-2fa';

const PostCode = async (code: string) => {
  try {
    const res = apiClient.post("/auth/two-factor", { code })
    return res;
  } catch (error) {
    throw error;
  }
};



function Security() {
  const [inputs, setInputs] = useState(['', '', '', '', '', '']);
  const inputRefs: React.MutableRefObject<HTMLInputElement | null>[] = [
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null)
  ];
  const [isVerified, setIsVerified] = useState<boolean | string>("nothing");
  const [message, setMessage] = useState("")
  const { userData, setUserData } = useGlobalUserContext();
  const router = useRouter()

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && inputs[index] === '') {
      event.preventDefault();
      const newInputs = [...inputs];
      if (index > 0) {
        newInputs[index - 1] = "";
        inputRefs[index - 1]?.current?.focus();
        setInputs(newInputs);

      }
    }
  };
  const getUserData = () => {
    const { request, cancel } = userService.getUser<User>();
    request
      .then((res :any) => {
        setUserData(res.data);
      })
      .catch((err :any) => {
        if (err instanceof CanceledError) return;
      });
    return () => {
      cancel();
    };
  }
  const handleInputChange = (index: number, value: string) => {
    const newValue = value.replace(/[^0-9]/g, "").slice(0, 1);
    const newInputs = [...inputs];
    newInputs[index] = newValue;
    if (newValue && index < inputRefs.length - 1) {
      inputRefs[index + 1]?.current?.focus();
    }
    if (!newValue && index > 0) {
      inputRefs[index - 1]?.current?.focus();
    }
    setInputs(newInputs);
  };

  const handleSubmit = () => {
    const code = inputs.join("");
    try {
      PostCode(code).then((res) => {
        if (res.data.message === true) {
          setIsVerified(true);
          getUserData();
          router.push(`${process.env.NEXT_PUBLIC_API_URL}:3000/profile`);
        }
        else if (res.data.message === false) {
          setIsVerified(false);
        }
      });

    } catch (error) {
      setMessage("Verification failed. Please try again.");
    }
  };
  return (
    <Wrappertfa>
      <div className="flex h-full w-full  flex-col justify-end rounded-[20px] bg-[#3D3D3D] p-8 ">
        <div className=" h-[20%] w-full ">
          <p className=" px-4  text-center font-vietnam text-md lg:text-2xl font-bold text-white ">
            Defend your gaming legacy with an extra layer of protection
          </p>
        </div>
        <div className=" h-[20%] w-full  ">
          <p className="flex h-full w-full items-center justify-center text-center font-vietnam text-lg lg:text-xl font-bold text-[#BCBCBC]">
            Enter code :
          </p>
        </div>
        <div className="h-[60%] w-full flex-row flex items-center justify-center  " >

          <div className=' h-full w-auto flex flex-col items-center justify-between gap-5 p-2 '>
            <div className="flex flex-col items-center justify-around  w-auto max-w-xs h-full">
              <div className="flex flex-row w-auto justify-center space-x-1 md:space-x-4 h-[20%]">
                {inputs.map((value, index) => (
                  <input
                    key={index}
                    type="text"
                    className={`w-[25%] px-0 py-0 text-center text-white font-extrabold text-[10px] border-2 ${isVerified === "nothing" ? "border-white" : isVerified ? "border-green-500" : "border-primary"} bg-transparent rounded-md text-sm`} value={value}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    ref={inputRefs[index]}
                  />
                ))}
              </div>
              <button
                className="bg-gradient-to-b from-neutral-700 to-neutral-700 text-white w-4/5 text-lg font-bold text-center px-15 py-4 shadow-md shadow-[#242424] hover:bg-hover hover:text-primary rounded-[12px]"
                onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </Wrappertfa>
  );
}

function Auth() {
  return (
    <main className='bg-center bg-cover' style={{ backgroundImage: "url('/Auth-Background.png')" }}>
      <div className="h-screen bg-cover w-screen m-0 p-0 flex flex-row-reverse ">
        <div className=" h-dvh  w-full flex flex-row-reverse justify-center">
          <Asset />
          <div className=" flex h-dvh w-full items-center justify-center lg:w-[50%]">
            <div className="flex h-2/4 w-auto px-16  items-center justify-center  rounded-[20px] bg-[#383838] shadow-md shadow-[#242424] lg:h-[45%]   ">
              <div className="flex h-5/6  w-auto flex-col  items-center  justify-evenly rounded-[20px] border-2  border-[#646464] bg-[#383838] ">
                <Security />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Auth;
