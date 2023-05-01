import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";

import { useAuthContext } from "../contexts/authContext";

import Danger from "../assets/danger.svg";
import Mail from "../assets/mail.svg";
import Lock from "../assets/lock.svg";
import Left from "../assets/left.svg";
import Right from "../assets/right.svg";

import { Header } from "../components";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const location = useLocation();

  const { setUser, user } = useAuthContext();

  useEffect(() => {
    if (user) {
      if (location?.state?.from?.pathname) {
        navigate(location.state.from.pathname);
      } else {
        navigate("/profile");
      }
    }
  }, [user]);

  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tmpErrors = { email: false, password: false };
    let flag = false;

    if (!formState.email.trim()) {
      tmpErrors.email = true;
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
        const { data } = await axios.post("/auth/login", formState);
        setUser(data);
        localStorage.setItem("token", data.token);
      } catch (e) {
        console.log(e);
        setErrors({
          email: true,
          password: true,
        });
      }
    }
  };
  return (
    <div className="bg-[#230E2B] h-screen overflow-y-scroll text-white py-[30px] relative">
      <div className="absolute left-0 bottom-0 hidden lg:block w-[300px]">
        <img src={Left} />
      </div>
      <div className="absolute right-0 bottom-0 hidden lg:block w-[350px]">
        <img src={Right} />
      </div>
      <Header />
      <div className="container mt-[50px] md:mt-[105px] mx-auto flex items-center justify-center flex-col gap-[10px] text-center">
        <h1 className="text-[36px] md:text-[60px]">Знакомства без преград</h1>
        <p className="text-base max-w-[840px]">
          Для современного мира сплочённость команды профессионалов однозначно
          фиксирует необходимость системы обучения кадров, соответствующей
          насущным потребностям.
        </p>
        <form
          onSubmit={handleSubmit}
          className="mt-[50px] flex flex-col gap-[10px]"
        >
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
              type={showPassword ? "text" : "password"}
              name="password"
              value={formState.password}
              onChange={handleChange}
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
            Войти
          </button>
          <Link
            to="/login/moderator"
            className="text-[#925FA4] mt-[10px] text-sm cursor-pointer"
          >
            Я модератор
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
