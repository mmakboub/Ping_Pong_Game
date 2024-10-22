import React from "react";
import NavBar from "../components/NavBar/navBar";
import Header from "../components/Header/Header";
import Wrapper from "../components/Wrapper/Wrapper";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Wrapper>
    <main className="fixed flex h-screen w-screen flex-col-reverse md:flex-row">
      {/* main content */}
      <NavBar />
      <div className="flex h-full w-full flex-col gap-5 overflow-hidden px-5 pb-5">
        <Header />

        {/* content  */}
        {children}
      </div>
    </main>
    </Wrapper>
  );
};

export default Layout;
