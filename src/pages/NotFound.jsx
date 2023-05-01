import ChevronLeft from "../assets/chevron-left.svg";
import Vector from "../assets/vector.svg";

import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <main className="pt-[150px] text-[#FFFDFD] h-screen container mx-auto relative">
      <img
        src={Vector}
        className="absolute scale-90 left-1/2 top-[60%] translate-y-[-50%] translate-x-[-50%] z-10"
      />
      <div className="absolute left-1/2 top-[60%] translate-y-[-50%] translate-x-[-50%] z-20 flex flex-col items-center">
        <h1 className="text-[150px] md:text-[300px] font-medium">404</h1>
        <p className="text-sm md:text-[20px] md:leading-[30px] leading-[21px] -mt-10 md:-mt-20 text-center md:text-left">
          Вы заблудились. Но не беспокойтесь: вот правильный путь
        </p>
        <button
          onClick={() => navigate(-1)}
          className="py-[18px] px-[36px] rounded-[30px] border border-[#FFFDFD] text-base mt-6 md:mt-12 flex items-center gap-2"
        >
          <img src={ChevronLeft} className="w-6 h-6" />
          Вернуться назад
        </button>
      </div>
    </main>
  );
};

export default NotFound;
