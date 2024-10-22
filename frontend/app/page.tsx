import Image from "next/image";
import { Be_Vietnam_Pro } from "next/font/google";
import Footer from "./components/Footer/Footer";
import { relative } from "path";
import LandingPageNavBar from "./components/landingPageNavBar/landingPageNavBar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* container ?? */}
      <LandingPageNavBar />
      {/* Home section */}
      <div
        id="home"
        className="flex  h-screen  w-screen flex-col items-center justify-center p-10 pt-16 lg:flex-row"
        style={{
          backgroundImage: "url('/images/landing-bg.png')",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Girl */}
        <div className="relative flex h-dvh w-auto flex-1 items-center justify-center">
          <div className="absolute right-[30%] top-[40%] h-[300px] w-[300px] rounded-full bg-white blur-[300px] filter"></div>
          <div className="flex w-full  max-w-2xl flex-1 flex-col items-center justify-center gap-8">
            {/* header */}
            <div className="pl-4">
              <p
                className="font-LilitaOne text-5xl text-white  drop-shadow-2xl lg:text-7xl "
                style={{ fontWeight: 800, textShadow: "9px 9px black" }}
              >
                Where every click is a smash
              </p>
            </div>
            {/* image + text */}
            <div className="z-[10] flex flex-row items-center justify-center">
              {/* image */}
              <div className="flex  w-[45%]">
                <Image
                  src="/images/avatar3.png"
                  alt="Excited girl"
                  width="200"
                  height="100"
                />
              </div>
              {/* text */}
              <div className="flex-1 ">
                <p
                  className="font-lexend text-2xl text-white drop-shadow-xl    lg:text-4xl"
                  style={{ textShadow: "6px 6px 6px black" }}
                >
                  Get ready to paddle your way to glory with our addictive ping
                  pong challenge!
                </p>
              </div>
            </div>
            {/* button "Play Now" */}
            <div className="lg:w-[50%]  ">
              <Link
                href={"../auth"}
                type="button"
                className="mb-2 me-2 w-full  rounded-lg  border-4 border-[#515151] px-8 py-3 text-center font-LilitaOne  text-xl font-medium text-white hover:bg-hover hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 lg:px-6 lg:py-6 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-800"
                style={{ fontWeight: 700 }}
              >
                Login
              </Link>
            </div>
          </div>
        </div>
        {/* Man */}
        <div className="flex  h-dvh w-auto flex-1 items-center justify-center">
          <div className="flex  min-w-[50%] items-center justify-center ">
            <Image
              src="/images/player-pong.svg"
              width={502.15}
              height={572.82}
              className="flex-end flex" // Adjusted height classes
              alt="Player pong"
            />
          </div>
        </div>
      </div>
      {/* About section */}
      <div
        id="about"
        className="flex h-screen flex-col  items-center gap-5 bg-[#3B3B3B] p-5  pl-10  lg:flex-row"
      >
        <div className="flex items-center justify-center">
          <Image
            src="/images/play-field.svg"
            alt="stade"
            className="h-70  md:h-auto" // Adjusted height classes
            width={550}
            height={550}
          />
        </div>
        {/* text */}
        <div className="flex  h-auto w-auto flex-1 items-center justify-center ">
          <div className=" md:h-500px   md:w-300px max-h-[700px] max-w-[600px] bg-[#484848]">
            <div className=" px-10 pt-4 font-BeVietnamPro text-40 font-bold text-white">
              About
            </div>
            <p
              className="text-md px-10 py-3  font-BeVietnamPro font-bold text-white lg:text-2xl"
              style={{
                fontWeight: 700,
              }}
            >

              {`Welcome to ping pong! Your one-stop destination for all things ping pong. Join us in the ultimate ping pong experience, where you can improve your skills, connect with fellow players, and stay updated with the latest trends in the game. Let's rally together and take your passion for ping pong to the next level.`}</p>
          </div>
        </div>
      </div>

      {/* Play section */}
      <div
        id="play"
        className="  flex h-screen items-center justify-center  pt-16" style={{ backgroundImage: "radial-gradient(circle, rgba(128,33,33,1) 0%, rgba(53,53,53,1) 73%)" }}
      >
        <div className=" left-[10%]  mb-9  h-[800px] w-[20px]   bg-[#CD4D4D75] blur-[500px] filter"></div>
        <div className="   mx-auto  h-[40%] w-[60%] rounded-[2.5rem] shadow-2xl ">
          <div className="flex h-full   w-full  flex-col items-center overflow-hidden rounded-[2rem] bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-600 p-5 shadow-2xl drop-shadow-2xl ">
            <div className="  flex  h-auto w-auto items-center justify-center ">
              <p className="font-Vietnam h-auto  w-auto pt-5  text-center text-2xl font-bold text-white  lg:text-7xl ">
                Ready to play ? let&apos;s ping pong now!
              </p>
            </div>
            <div className="flex flex-row h-full w-full justify-between">
              <Image
                src="/images/player2.png"
                alt="player"
                height={145}
                width={145}
                className="h-auto w-auto"
              />
              <div className="container  flex  justify-center  items-center ">
                <Link
                  href={"../auth"}
                  className="  h-auto w-auto rounded-lg  border-2 border-[#515151] md:mr-20  bg-gradient-to-r from-red-600 via-pink-700 to-purple-800 py-3 px-6 text-center  font-LilitaOne  text-2xl font-bold text-white"
                >
                  Start Now!
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
