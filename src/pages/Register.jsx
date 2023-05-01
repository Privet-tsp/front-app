import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { BsFillImageFill } from "react-icons/bs";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";

import { useAuthContext } from "../contexts/authContext";

import Danger from "../assets/danger.svg";
import Mail from "../assets/mail.svg";
import Lock from "../assets/lock.svg";
import User from "../assets/user.svg";
import Left from "../assets/left-register.svg";
import Right from "../assets/right-register.svg";

import { Header } from "../components";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  const { setUser, user } = useAuthContext();

  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (location?.state?.from?.pathname) {
        navigate(location.state.from.pathname);
      } else {
        navigate("/profile");
      }
    }
  }, [user]);

  const [formState, setFormState] = useState({
    email: "",
    password: "",
    avatarUrl: "",
    userName: "",
  });

  const [errors, setErrors] = useState({
    email: false,
    avatarUrl: false,
    password: false,
    userName: false,
  });

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tmpErrors = {
      email: false,
      password: false,
      userName: false,
      avatarUrl: false,
    };
    let flag = false;
    if (!formState.userName.trim()) {
      tmpErrors.userName = true;
      flag = true;
    }
    if (!formState.email.trim()) {
      tmpErrors.email = true;
      flag = true;
    }
    if (!formState.avatarUrl.trim()) {
      tmpErrors.avatarUrl = true;
      flag = true;
    }
    if (!formState.password.trim()) {
      tmpErrors.password = true;
      flag = true;
    }
    if (formState.password.length < 5) {
      tmpErrors.password = true;
      flag = true;
    }

    setErrors(tmpErrors);
    if (flag) {
      return;
    } else {
      try {
        const { data } = await axios.post("/auth/register", formState);
        setUser(data);
        localStorage.setItem("token", data.token);
      } catch (e) {
        console.log(e);
        setErrors({
          email: true,
          password: true,
          userName: true,
        });
      }
    }
  };

  return (
    <div className="bg-[#230E2B] h-screen overflow-y-scroll text-white md:pt-[30px] md:pb-0 py-[30px] relative">
      <div className="absolute left-0 bottom-0 hidden lg:block w-[300px]">
        <img src={Left} />
      </div>
      <div className="absolute right-0 bottom-0 hidden lg:block w-[250px]">
        <img src={Right} />
      </div>
      <Header />
      <div className="container mt-[50px] md:mt-[65px] mx-auto flex items-center justify-center flex-col gap-[10px] text-center">
        <h1 className="text-[36px] font-medium">Создай новый аккаунт</h1>
        <p className="text-base text-[#6E447B]">
          Присоединяйся к сообществу из 518 млн человек!
        </p>
        <form onSubmit={handleSubmit} className="mt-[30px] flex flex-col gap-5">
          <div
            className={`w-[380px] h-[70px] bg-[#42204E] rounded-[500px] flex items-center px-[30px] ${
              errors.userName && "invalid"
            }`}
          >
            <img src={User} className="mr-5 text-[#8B5D9A]" />
            <input
              type="text"
              name="userName"
              value={formState.userName}
              onChange={handleChange}
              className="text-white placeholder:text-[#8B5D9A] outline-none border-none bg-transparent w-full"
              placeholder="Ваше имя"
            />
            {errors.userName && <img src={Danger} />}
          </div>
          <div
            className={`w-[380px] h-[70px] bg-[#42204E] rounded-[500px] flex items-center px-[30px] ${
              errors.avatarUrl && "invalid"
            }`}
          >
            <BsFillImageFill className="mr-5 text-[#8B5D9A] text-xl" />
            <input
              type="text"
              name="avatarUrl"
              value={formState.avatarUrl}
              onChange={handleChange}
              className="text-white placeholder:text-[#8B5D9A] outline-none border-none bg-transparent w-full"
              placeholder="Фотография"
            />
            {errors.avatarUrl && <img src={Danger} />}
          </div>
          <div
            className={`w-[380px] h-[70px] bg-[#42204E] rounded-[500px] flex items-center px-[30px] ${
              errors.email && "invalid"
            }`}
          >
            <img src={Mail} className="mr-5 text-[#8B5D9A]" />
            <input
              type="email"
              name="email"
              value={formState.email}
              onChange={handleChange}
              className="text-white placeholder:text-[#8B5D9A] outline-none border-none bg-transparent w-full"
              placeholder="Введите электронную почту"
            />
            {errors.email && <img src={Danger} />}
          </div>
          <div
            className={`w-[380px] h-[70px] bg-[#42204E] rounded-[500px] flex items-center px-[30px] ${
              errors.password && "invalid"
            }`}
          >
            <img src={Lock} className="mr-5 text-[#8B5D9A]" />
            <input
              value={formState.password}
              name="password"
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              className="text-white placeholder:text-[#8B5D9A] outline-none border-none bg-transparent w-full"
              placeholder="Введите пароль"
            />
            {showPassword ? (
              <AiFillEyeInvisible
                onClick={() => setShowPassword(!showPassword)}
                className="text-[24px] cursor-pointer text-[#8B5D9A]"
              />
            ) : (
              <AiFillEye
                onClick={() => setShowPassword(!showPassword)}
                className="text-[24px] cursor-pointer text-[#8B5D9A]"
              />
            )}
            {errors.password && <img className="ml-4" src={Danger} />}
          </div>
          <button
            type="submit"
            className="gradient-btn-submit rounded-[500px] w-[380px] text-white h-[70px] transition duration-500 ease-in outline-none"
          >
            Создать аккаунт
          </button>
          <Link
            to="/register/moderator"
            className="text-[#925FA4] text-sm cursor-pointer"
          >
            Я модератор
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Register;
