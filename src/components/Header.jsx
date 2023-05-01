import Logo from "../assets/logo.svg";
import { useLocation, Link } from "react-router-dom";

const Header = () => {
  const { pathname } = useLocation();
  return (
    <header>
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between py-3">
        <Link to="/profile" className="flex items-center gap-5">
          <img src={Logo} />
          <h2 className="text-white text-[22px] font-medium">Privet.com</h2>
        </Link>
        <div className="flex flex-col mt-[30px] md:mt-0 md:flex-row items-center gap-5 text-white">
          <button>Уже есть аккаунт?</button>
          <Link
            to={pathname === "/register" ? "/login" : "/register"}
            className="h-[46px] w-[172px] rounded-[500px] bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[1px]"
          >
            <span className="flex h-full w-full items-center justify-center bg-[#230E2B] rounded-[500px]">
              <span className=" text-white">
                {pathname === "/register" ? "Войти" : "Регистрация"}
              </span>
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
