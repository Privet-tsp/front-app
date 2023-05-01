import {
  AiFillEye,
  AiFillEyeInvisible,
  AiOutlineFieldNumber,
} from "react-icons/ai";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
        navigate("/all");
      }
    }
  }, [user]);

  const [formState, setFormState] = useState({
    moderatorId: "",
    key: "",
    moderatorName: "",
    contacts: "",
  });

  const [errors, setErrors] = useState({
    moderatorId: false,
    key: false,
    moderatorName: false,
    contacts: false,
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
      moderatorId: false,
      key: false,
      moderatorName: false,
      contacts: false,
    };
    let flag = false;
    if (!formState.moderatorId.trim()) {
      tmpErrors.moderatorId = true;
      flag = true;
    }
    if (!formState.moderatorName.trim()) {
      tmpErrors.moderatorName = true;
      flag = true;
    }
    if (!formState.contacts.trim()) {
      tmpErrors.contacts = true;
      flag = true;
    }
    if (!formState.key.trim()) {
      tmpErrors.key = true;
      flag = true;
    }
    if (formState.key.length < 2) {
      tmpErrors.key = true;
      flag = true;
    }

    setErrors(tmpErrors);
    if (flag) {
      return;
    } else {
      try {
        const { data } = await axios.patch("/moderation/register", formState);
        setUser(data);
        localStorage.setItem("token", data.token);
      } catch (e) {
        console.log(e);
        setErrors({
          moderatorId: false,
          key: false,
          moderatorName: false,
          contacts: false,
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
        <h1 className="text-[36px] font-medium">Регистрация модератора</h1>
        <p className="text-base text-[#6E447B]">
          Суперсекретная страница регистрации модератора 🤫
        </p>
        <form onSubmit={handleSubmit} className="mt-[30px] flex flex-col gap-5">
          <div
            className={`w-[380px] h-[70px] bg-[#42204E] rounded-[500px] flex items-center px-[30px] ${
              errors.moderatorId && "invalid"
            }`}
          >
            <AiOutlineFieldNumber className="mr-3 text-3xl text-[#8B5D9A]" />
            <input
              type="text"
              name="moderatorId"
              value={formState.moderatorId}
              onChange={handleChange}
              className="text-white placeholder:text-[#8B5D9A] outline-none border-none bg-transparent w-full"
              placeholder="Id модератора"
            />
            {errors.moderatorId && <img src={Danger} />}
          </div>
          <div
            className={`w-[380px] h-[70px] bg-[#42204E] rounded-[500px] flex items-center px-[30px] ${
              errors.moderatorName && "invalid"
            }`}
          >
            <img src={User} className="mr-5 text-[#8B5D9A]" />
            <input
              type="text"
              name="moderatorName"
              value={formState.moderatorName}
              onChange={handleChange}
              className="text-white placeholder:text-[#8B5D9A] outline-none border-none bg-transparent w-full"
              placeholder="Имя модератора"
            />
            {errors.moderatorName && <img src={Danger} />}
          </div>
          <div
            className={`w-[380px] h-[70px] bg-[#42204E] rounded-[500px] flex items-center px-[30px] ${
              errors.contacts && "invalid"
            }`}
          >
            <img src={Mail} className="mr-5 text-[#8B5D9A]" />
            <input
              type="text"
              name="contacts"
              value={formState.contacts}
              onChange={handleChange}
              className="text-white placeholder:text-[#8B5D9A] outline-none border-none bg-transparent w-full"
              placeholder="Контакты"
            />
            {errors.contacts && <img src={Danger} />}
          </div>
          <div
            className={`w-[380px] h-[70px] bg-[#42204E] rounded-[500px] flex items-center px-[30px] ${
              errors.key && "invalid"
            }`}
          >
            <img src={Lock} className="mr-5 text-[#8B5D9A]" />
            <input
              value={formState.key}
              name="key"
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              className="text-white placeholder:text-[#8B5D9A] outline-none border-none bg-transparent w-full"
              placeholder="Введите ключ"
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
            {errors.key && <img className="ml-4" src={Danger} />}
          </div>
          <button
            type="submit"
            className="gradient-btn-submit rounded-[500px] w-[380px] text-white h-[70px] transition duration-500 ease-in outline-none"
          >
            Создать аккаунт
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
