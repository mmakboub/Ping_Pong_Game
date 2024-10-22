import React, { useState, useRef, useEffect } from 'react';
import apiClient from '@/app/services/api-client';
import { useGlobalUserContext } from "@/app/context/UserDataContext";
import Image from 'next/image';

export const getQrcode = async () => {
  try {
    const res = await apiClient.get("/tfa/generate-2fa");
    return res;
  } catch (error) {
    throw error;
  }
};

export const PostCode = async (code: any) => {
  try {
    const res = apiClient.post("/tfa/enable-2fa", { code });
    return res;
  } catch (error) {
    throw error;
  }
};

export const Postdisable = async () => {
  try {
    const res = apiClient.post("/tfa/disable-2fa");
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
  const [qrCode, setQrCode] = useState("");
  const { userData, setUserData } = useGlobalUserContext();
  const [isVerified, setIsVerified] = useState<boolean | string>("nothing");
  const [message, setMessage] = useState("");

  useEffect(() => {
    getQrcode()
      .then((res) => {
        setQrCode(res.data.qrcode);
      })
      .catch((error) => {
        console.error("Error fetching QR code:", error);
      });
  }, []);

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && inputs[index] === '') {
      event.preventDefault();
      const newInputs = [...inputs];
      if (index > 0) {
        newInputs[index - 1] = '';
        inputRefs[index - 1]?.current?.focus();
        setInputs(newInputs);
      }
    }
  };
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
  const handleDisable = async () => {
    try {
      const res = await Postdisable();
      console.log(res.data);
      if (res.data.message === 'disabled') {
        setIsVerified("nothing");
        setUserData(prevUserData => ({
          ...prevUserData,
          twoFactor: false
        }))
        getQrcode()
          .then((res) => {
            setQrCode(res.data.qrcode);
          })
          .catch((error) => {
            console.error("Error fetching QR code:", error);
          });
      }
    } catch (error) {
      setMessage("Verification failed. Please try again.");
    }
  };

  const handleEnable = async () => {
    const code = inputs.join("");
    try {
      const res = await PostCode(code);
      console.log(res.data);
      if (res.data.message === 'true') {
        setIsVerified(true);
        setUserData(prevUserData => ({
          ...prevUserData,
          twoFactor: true
        }))
      } else if (res.data.message === 'false') {
        setIsVerified(false);
      }
    } catch (error) {
      setMessage("Verification failed. Please try again.");
    }
  };

  return (
    <div className='w-full h-full rounded-[20px] bg-[#3D3D3D] flex mb flex-col'>
      <div className="h-[10%] w-full rounded-xl">
        <div className='px-4 py-4 pl-10 font-vietnam font-bold text-xl lg:text-2xl   xl:text-3xl text-white'>Security</div>
        <hr className="h-px w-[95%] my-2 mx-auto bg-[#515151] border-0" />
      </div>
      <div className="h-[20%] w-full rounded-xl">
        <div className='px-2 py-2 text-center font-vietnam font-bold text-white text-xl lg:text-2xl xl:text-3xl  hover:text-primary'>Two Factor Authentication (2FA)</div>
        <hr className="h-px w-[25%] my-2 mx-auto bg-[#515151] border-0" />
      </div>
      <div className="h-[65%] w-full flex-row flex items-center justify-center">
        <div className='w-1/2 flex items-center justify-center p-10 mb-4 flex-col h-full gap-8'>
          <h1 className="text-xl  lg:text-2xl  xl:text-3xl font-bold text-white text-center">Steps to Enable Two-Factor Authentication:</h1>
          <ol className="list-decimal text-white font-light font-vietnam text-xl lg:text-2xl  xl:text-2xl pl-12">
            <li>Download an authenticator app on your phone.</li>
            <li>Scan the QR code in your account settings with the app.</li>
            <li>Enter the code from the app into your account settings.</li>
          </ol>
        </div>
        <div className='w-1/2 h-full flex flex-col items-center border-l border-[#515151] justify-center gap-9 p-4'>
          <Image
            src={qrCode}
            alt="QrCode Image"
            className="w-[165px]"
            width={165}
            height={165}
            priority
          />
          <div className="flex flex-col items-center justify-evenly w-full max-w-xs h-[40%]">
            <div className="flex flex-row justify-center space-x-3 h-[20%]">
              {inputs.map((value, index) => (
                <input
                  key={index}
                  type="text"
                  className={`w-[20%] h-full text-center text-white font-extrabold text-[10px] border-2 ${isVerified === "nothing" ? "border-white" : isVerified ? "border-green-500" : "border-primary"} bg-transparent rounded-md text-sm`}
                  value={value}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={inputRefs[index]}
                />
              ))}
            </div>
            {userData.twoFactor === false ? (
              <button className="bg-gradient-to-b from-neutral-700 to-neutral-700 text-white w-3/5 text-m font-bold text-center px-10 py-5 shadow-md shadow-[#242424] hover:bg-hover hover:text-primary rounded-[20px]" onClick={handleEnable}>
                Enable 2FA
              </button>
            ) : (
              <button className="bg-gradient-to-b from-neutral-700 to-neutral-700 text-white w-3/5 text-m font-bold text-center px-10 py-5 shadow-md shadow-[#242424] hover:bg-hover hover:text-primary rounded-[20px]" onClick={handleDisable}>
                Disable 2FA
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Security;