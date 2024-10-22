"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
export default function LandingPageNavBar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [activeHash, setActiveHash] = useState<string>("");
  const navbarBtnPrefixClasses =
    "block  relative before:bg-white before:absolute before:h-1 before:w-0 before:bottom-0 before:left-0  hover:before:w-full before:transition-all before:duration-500 cursor-pointer py-2  px-3 text-white rounded md:bg-transparent md:p-0  font-vietnam font-bold hover:before:scaleXbefore:scaleX0 md:hover:bg-transparent md:hover:text-primary";

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  /**
   * Register a listener on the hash value (/#...) change
   */
  useEffect(
    () => {
      const handleHashChange = () => {
        setActiveHash(window.location.hash);
      };

      // Set initial hash
      handleHashChange();

      // Listen for hash changes
      window.addEventListener("hashchange", handleHashChange);

      return () => {
        window.removeEventListener("hashchange", handleHashChange);
      };
    },
    [
      // this function will be called only one time when the component is mounted
    ]
  );

  /**
   * Function to check if a string equals to page hash value (/#...)
   * @param hashValue string
   * @returns boolean
   */
  const isActive = (hashValue: string): boolean => {
    return activeHash === hashValue;
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur">
      <div className="mx-auto  flex w-[80%] flex-wrap items-center justify-between p-4">
        <a
          href="/#home"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <Image
            src="/images/logo.png"
            alt="Pong Logo"
            height={70}
            width={70}
          />
        </a>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded="false"
          onClick={toggleMobileMenu}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="h-5 w-5"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          className={`${isMobileMenuOpen ? "" : "hidden"
            } w-full md:block md:w-auto`}
          id="navbar-default"
        >
          <ul className="mt-4 flex flex-col rounded-lg border p-4 font-BeVietnamPro no-underline md:mt-0 md:flex-row md:space-x-8 md:border-0 md:p-0 rtl:space-x-reverse">
            <li>
              <a
                href="#home"
                className={`${navbarBtnPrefixClasses} ${activeHash == "" || isActive("#home")
                  ? "bg-primary md:text-primary md:dark:text-primary"
                  : ""
                  }`}
                aria-current="page"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#about"
                className={`${navbarBtnPrefixClasses} ${isActive("#about")
                  ? "bg-primary md:text-primary md:dark:text-primary"
                  : ""
                  }`}
              >
                About
              </a>
            </li>

            <li>
              <a
                href="#play"
                className={`${navbarBtnPrefixClasses} ${isActive("#play")
                  ? "bg-primary md:text-primary md:dark:text-primary"
                  : ""
                  }`}
              >
                Play
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className={`${navbarBtnPrefixClasses} ${isActive("#contact")
                  ? "bg-primary md:text-primary md:dark:text-primary"
                  : ""
                  }`}
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
