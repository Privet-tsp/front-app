import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../contexts/authContext";

import Logo from "../assets/logo.svg";
import Search from "../assets/search.svg";
import Bell from "../assets/bell.svg";

const Navbar = ({ setIsOpen }) => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  return (
    <nav className="h-[120px] px-4 md:px-0 fixed z-30 top-0 left-0 right-0 bg-[#2D1436]">
      <div className="container mx-auto h-full flex items-center md:justify-between">
        <Link
          to={!user?.moderatorId ? "/profile" : "/all"}
          className="flex items-center gap-5"
        >
          <img src={Logo} />
          <h2 className="hidden md:block text-white text-[22px] font-medium">
            Privet.com
          </h2>
        </Link>
        <ul className="hidden md:flex items-center h-full gap-[50px] text-base">
          {!user?.moderatorId ? (
            <>
              <li className="h-full">
                <NavLink
                  className="inline-flex link items-center h-full 
              relative hover:text-[#FE6703] hover:before:absolute hover:before:bottom-0 hover:before:left-0 hover:before:right-0 hover:before:h-1 hover:before:bg-gradient-to-r hover:before:from-pink-500 hover:before:via-red-500 hover:before:to-yellow-500"
                  to="/search"
                >
                  Анкеты
                </NavLink>
              </li>
              <li className="h-full">
                <span
                  className="inline-flex cursor-pointer link items-center h-full 
              relative hover:text-[#FE6703] hover:before:absolute hover:before:bottom-0 hover:before:left-0 hover:before:right-0 hover:before:h-1 hover:before:bg-gradient-to-r hover:before:from-pink-500 hover:before:via-red-500 hover:before:to-yellow-500"
                  onClick={() => setIsOpen(true)}
                >
                  Сообщения
                </span>
              </li>
            </>
          ) : (
            <>
              <li className="h-full">
                <NavLink
                  className="inline-flex link items-center h-full 
              relative hover:text-[#FE6703] hover:before:absolute hover:before:bottom-0 hover:before:left-0 hover:before:right-0 hover:before:h-1 hover:before:bg-gradient-to-r hover:before:from-pink-500 hover:before:via-red-500 hover:before:to-yellow-500"
                  to="/all"
                >
                  Пользователи
                </NavLink>
              </li>
              <li className="h-full">
                <NavLink
                  className="inline-flex link items-center h-full 
              relative hover:text-[#FE6703] hover:before:absolute hover:before:bottom-0 hover:before:left-0 hover:before:right-0 hover:before:h-1 hover:before:bg-gradient-to-r hover:before:from-pink-500 hover:before:via-red-500 hover:before:to-yellow-500"
                  to="/appeals"
                >
                  Жалобы
                </NavLink>
              </li>
            </>
          )}
        </ul>
        <div className="flex ml-auto md:ml-0 items-center gap-[50px]">
          <div className="flex items-center justify-between gap-8 md:gap-4">
            <img
              className="cursor-pointer w-10 h-10 md:w-auto md:h-auto"
              src={Search}
            />
            <div className="cursor-pointer relative">
              <img className="w-10 h-10 md:w-auto md:h-auto" src={Bell} />
              <span className="absolute -right-4 md:-right-[20px] -top-2 rounded-[20px] bg-gradient text-[10px] py-1 md:py-[1px] px-2 md:px-[6px]">
                123
              </span>
            </div>
          </div>
          <div
            onClick={() => !user?.moderatorId && navigate("/profile")}
            className="flex items-center gap-4 cursor-pointer"
          >
            <div className="h-[60px] w-[60px] md:w-10 md:h-10 flex flex-col rounded-full overflow-hidden">
              <img
                src={
                  user?.moderatorId
                    ? "https://yt3.googleusercontent.com/HEGmWuTWybONXx2S-yhTyithb6Dnz6YtijkqLhSPim8lzAwpOLDf8bDKu97l2cAkC8PUr-pUEg=s900-c-k-c0x00ffffff-no-rj"
                    : user?.avatarUrl
                }
                className="h-full w-full"
              />
            </div>
            <p className="capitalize">{user?.userName}</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
