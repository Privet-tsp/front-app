import { useState } from "react";
import { Navbar, Conversations, Report } from "./";

const SharedLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-[#230E2B] relative pb-[30px] text-white">
      <Navbar setIsOpen={setIsOpen} />
      <Conversations isOpen={isOpen} setIsOpen={setIsOpen} />
      <Report />
      {children}
    </div>
  );
};

export default SharedLayout;
