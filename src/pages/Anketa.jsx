import { useState, useEffect } from "react";
import { Loader } from "../components";
import { BsChevronLeft } from "react-icons/bs";
import moment from "moment";
import toast from "react-hot-toast";
import axios from "axios";

import { options, lifePathStatuses } from "./Profile";
import Love from "../assets/love.svg";
import Heart from "../assets/heart.svg";
import Close from "../assets/close.svg";
import Sadge from "../assets/sadge.png";

const Anketa = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const [candidates, setCandidates] = useState([]);

    const [loading, setLoading] = useState(false);

    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const fetchPeople = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                if (token) {
                    const { data } = await axios.get("/set", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setCandidates(data);
                }
            } catch (error) {
                console.log(error);
                toast.error("Ошибка при загрузке кандидатов");
            } finally {
                setLoading(false);
            }
        };
        fetchPeople();
    }, [refresh]);

    const prev = () => {
        setActiveIndex((p) => Math.max(0, p - 1));
    };
    const next = () => {
        setActiveIndex((p) => Math.min(candidates.length - 1, p + 1));
    };

    const request = async (path) => {
        try {
            const activeId = candidates?.[activeIndex]?._id;
            const token = localStorage.getItem("token");
            if (token) {
                const { data } = await axios.post(
                    `/profile/${path}/${activeId}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setActiveIndex((p) =>
                    p === candidates.length - 1 ? p - 1 : p
                );
                setCandidates((p) =>
                    p.filter((person) => person._id !== activeId)
                );
            }
        } catch (error) {
            console.log(error);
            toast.error("Что-то пошло не так...");
        }
    };

    const hasSearchStatusIndex =
        candidates?.[activeIndex]?.searchStatus ?? false;
    const hasLifePathIndex = candidates?.[activeIndex]?.lifePath ?? false;
    const registerDate = new Date(candidates?.[activeIndex]?.createdAt);
    const birthDate = new Date(candidates?.[activeIndex]?.bday);

    if (loading) {
        return <Loader />;
    }
    if (candidates.length === 0) {
        return (
            <main className="pt-[150px] text-[#FFFDFD] h-screen container mx-auto flex gap-[50px] items-center justify-center">
                <div className="flex flex-col gap-8 items-center">
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-[500]">
                            Список кандидатов пуст
                        </h1>
                        <img src={Sadge} className="w-20 h-20 -mt-12" />
                    </div>
                    <button
                        onClick={() => setRefresh((p) => !p)}
                        className="py-[18px] px-[36px] rounded-[30px] border border-[#FFFDFD] text-base  flex items-center gap-2"
                    >
                        Обновить
                    </button>
                </div>
            </main>
        );
    }
    return (
        <main className="mt-[120px] md:mt-[150px] text-[#FFFDFD] container mx-auto flex gap-[50px] items-center">
            <button
                onClick={prev}
                disabled={activeIndex === 0}
                className="w-[70px] flex-shrink-0 hidden lg:block h-[70px] rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[1px] transition ease-in active:scale-95"
            >
                <span className="w-full h-full flex items-center justify-center rounded-full bg-[#230E2B]">
                    <BsChevronLeft className="text-[22px] translate-x-[-2px]" />
                </span>
            </button>
            <div className="flex flex-col items-center md:items-start md:flex-row flex-grow gap-[50px]">
                <div className="w-full md:w-auto h-full md:h-auto flex flex-col items-center">
                    <div className="w-full md:w-[280px] h-[500px] md:h-[400px] flex-shrink-0  overflow-hidden rounded-0 md:rounded-[50px]">
                        <img
                            src={candidates?.[activeIndex]?.avatarUrl}
                            alt="avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="mt-5 flex items-center justify-center gap-4">
                        <button
                            onClick={() => request("antipathy")}
                            className="w-[60px] h-[60px] rounded-full flex items-center justify-center blue-gradient active:scale-95 transform transition ease-in relative group"
                        >
                            <img src={Close} />
                            <span className="absolute opacity-0 scale-0 transition ease-out group-hover:opacity-100 transform group-hover:scale-100 rounded-xl bg-[#2D1436] text-white before:absolute before:border-[5px] before:border-l-transparent before:border-r-transparent before:border-t-transparent before:left-1/2 before:translate-x-[-50%] w-40 before:top-[-10px] px-4 py-2 before:border-[#2D1436] -bottom-14 left-1/2 translate-x-[-50%]">
                                Не нравится
                            </span>
                        </button>
                        <button
                            onClick={() => request("sympathy")}
                            className="w-[60px] h-[60px] rounded-full flex items-center justify-center red-gradient active:scale-95 transform transition ease-in relative group"
                        >
                            <img src={Heart} />
                            <span className="absolute opacity-0 scale-0 transition ease-out group-hover:opacity-100 transform group-hover:scale-100  rounded-xl bg-[#2D1436] text-white before:absolute before:border-[5px] before:border-l-transparent before:border-r-transparent before:border-t-transparent before:left-1/2 before:translate-x-[-50%] before:top-[-10px] px-4 py-2 before:border-[#2D1436] -bottom-14 left-1/2 translate-x-[-50%]">
                                Нравится
                            </span>
                        </button>
                    </div>
                </div>
                <div className="w-full flex-grow flex flex-col items-center md:items-start px-4 md:px-0">
                    <div className="relative">
                        <h1 className="text-[32px] capitalize font-[500]">
                            {candidates?.[activeIndex]?.userName}{" "}
                            {candidates?.[activeIndex]?.bday &&
                                moment(new Date()).diff(birthDate, "years")}
                        </h1>
                        {candidates?.[activeIndex]?.profileStatus ? (
                            <span className="online w-[14px] h-[14px] absolute right-0 translate-x-[100%] top-0 rounded-full" />
                        ) : (
                            <span className="from-red-500 bg-gradient-to-r to-red-400 w-[14px] h-[14px] absolute right-0 translate-x-[100%] top-0 rounded-full" />
                        )}
                    </div>
                    <button className="mt-[10px] py-[14px] px-[30px] text-sm font-medium rounded-[40px] gradient-btn-submit flex items-center gap-[10px]">
                        Нравится
                        <img src={Love} className="w-6" />
                    </button>
                    <ul className="mt-[30px] space-y-[10px] text-base w-full">
                        <li className="flex items-center">
                            <div>Рост</div>
                            <div className="flex-grow border border-[#4A2956] border-dashed mx-5" />
                            <div>
                                {" "}
                                {candidates?.[activeIndex]?.userHeight ||
                                    "Не указано"}
                                {candidates?.[activeIndex]?.userHeight && " см"}
                            </div>
                        </li>
                        <li className="flex items-center">
                            <div>Хобби</div>
                            <div className="flex-grow border border-[#4A2956] border-dashed mx-5" />
                            <div>
                                {candidates?.[activeIndex]?.hobby ||
                                    "Не указано"}
                            </div>
                        </li>
                        <li className="flex items-center">
                            <div>Профессия</div>
                            <div className="flex-grow border border-[#4A2956] border-dashed mx-5" />
                            <div>
                                {candidates?.[activeIndex]?.profession ||
                                    "Не указано"}
                            </div>
                        </li>
                        <li className="flex items-center">
                            <div>Образование</div>
                            <div className="flex-grow border border-[#4A2956] border-dashed mx-5" />
                            <div>
                                {candidates?.[activeIndex]?.education ||
                                    "Не указано"}
                            </div>
                        </li>
                        <li className="flex items-center">
                            <div>Цель знакомства</div>
                            <div className="flex-grow border border-[#4A2956] border-dashed mx-5" />
                            <div>
                                {hasSearchStatusIndex !== false
                                    ? options[
                                          candidates?.[activeIndex]
                                              ?.searchStatus - 1
                                      ]
                                    : "Не указано"}
                            </div>
                        </li>
                        <li className="flex items-center">
                            <div>Главное в жизни</div>
                            <div className="flex-grow border border-[#4A2956] border-dashed mx-5" />
                            <div>
                                {hasLifePathIndex !== false
                                    ? lifePathStatuses[
                                          candidates?.[activeIndex]?.lifePath -
                                              1
                                      ]
                                    : "Не указано"}
                            </div>
                        </li>
                    </ul>
                    <div className="mt-[30px]">
                        <h2 className="font-[500] text-lg">О себе</h2>
                        <p className="mt-[5px]">
                            {candidates?.[activeIndex]?.userInfo ||
                                "Не указано"}
                        </p>
                    </div>
                    <p className="mt-5 text-[#8B5D9A] text-sm">
                        На сайте с{" "}
                        {`${registerDate.getDate()}.${
                            registerDate.getMonth() + 1
                        }.${registerDate.getFullYear()}`}
                    </p>
                </div>
            </div>
            <button
                onClick={next}
                disabled={activeIndex === candidates.length - 1}
                className="w-[70px] hidden lg:block flex-shrink-0 h-[70px] rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[1px] transition ease-in active:scale-95"
            >
                <span className="w-full h-full flex items-center justify-center rounded-full bg-[#230E2B]">
                    <BsChevronLeft className="text-[22px] translate-x-[2px] rotate-180" />
                </span>
            </button>
        </main>
    );
};

export default Anketa;
