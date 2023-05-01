import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Loader } from "../components";
import toast from "react-hot-toast";
import moment from "moment";

import { useAuthContext, useReportContext } from "../contexts";
import { options, lifePathStatuses } from "./Profile";
import Report from "../assets/report.svg";
import Love from "../assets/love.svg";

const User = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const {
        user: { moderatorId },
    } = useAuthContext();

    const { setReportUser, setIsOpen } = useReportContext();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                if (token) {
                    const { data } = await axios.get("/profile/" + id, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setUser(data);
                }
            } catch (error) {
                console.log(error);
                toast.error("Ошибка при загрузке профиля");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    const hasSearchStatusIndex = user?.searchStatus ?? false;
    const hasLifePathIndex = user?.lifePath ?? false;
    const registerDate = new Date(user?.createdAt);

    const handleReportClick = () => {
        setIsOpen(true);
        setReportUser(user);
    };

    if (loading) {
        <Loader />;
    }
    return (
        <main className="mt-[120px] md:mt-[150px] text-[#FFFDFD] container mx-auto flex gap-[50px] items-center">
            <div className="flex flex-col items-center md:items-start md:flex-row flex-grow gap-[50px]">
                <div className="w-full md:w-auto h-full md:h-auto flex flex-col items-center">
                    <div className="w-full md:w-[280px] h-[500px] md:h-[400px] flex-shrink-0  overflow-hidden rounded-0 md:rounded-[50px]">
                        <img
                            src={user?.avatarUrl}
                            alt="avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {!moderatorId && (
                        <button
                            onClick={handleReportClick}
                            className="blue-gradient px-6 py-4 rounded-[30px] text-white mt-4 hover:opacity-70 transition shadow flex items-center gap-2"
                        >
                            Пожаловаться{" "}
                            <img src={Report} className="h-6 w-6" />
                        </button>
                    )}
                </div>
                <div className="w-full flex-grow flex flex-col items-center md:items-start px-4 md:px-0">
                    <div className="relative">
                        <h1 className="text-[32px] capitalize font-[500]">
                            {user?.userName}{" "}
                            {user?.bday &&
                                moment(new Date()).diff(
                                    new Date(user?.bday),
                                    "years"
                                )}
                        </h1>
                        {user?.profileStatus ? (
                            <span className="online w-[14px] h-[14px] absolute right-0 translate-x-[100%] top-0 rounded-full" />
                        ) : (
                            <span className="from-red-500 bg-gradient-to-r to-red-400 w-[14px] h-[14px] absolute right-0 translate-x-[100%] top-0 rounded-full" />
                        )}
                    </div>
                    {!moderatorId && (
                        <button className="mt-[10px] py-[14px] px-[30px] text-sm font-medium rounded-[40px] gradient-btn-submit flex items-center gap-[10px]">
                            Нравится
                            <img src={Love} className="w-6" />
                        </button>
                    )}
                    <ul className="mt-[30px] space-y-[10px] text-base w-full">
                        <li className="flex items-center">
                            <div>Рост</div>
                            <div className="flex-grow border border-[#4A2956] border-dashed mx-5" />
                            <div>
                                {" "}
                                {user?.userHeight || "Не указано"}
                                {user?.userHeight && " см"}
                            </div>
                        </li>
                        <li className="flex items-center">
                            <div>Хобби</div>
                            <div className="flex-grow border border-[#4A2956] border-dashed mx-5" />
                            <div>{user?.hobby || "Не указано"}</div>
                        </li>
                        <li className="flex items-center">
                            <div>Профессия</div>
                            <div className="flex-grow border border-[#4A2956] border-dashed mx-5" />
                            <div>{user?.profession || "Не указано"}</div>
                        </li>
                        <li className="flex items-center">
                            <div>Образование</div>
                            <div className="flex-grow border border-[#4A2956] border-dashed mx-5" />
                            <div>{user?.education || "Не указано"}</div>
                        </li>
                        <li className="flex items-center">
                            <div>Цель знакомства</div>
                            <div className="flex-grow border border-[#4A2956] border-dashed mx-5" />
                            <div>
                                {hasSearchStatusIndex !== false
                                    ? options[user?.searchStatus - 1]
                                    : "Не указано"}
                            </div>
                        </li>
                        <li className="flex items-center">
                            <div>Главное в жизни</div>
                            <div className="flex-grow border border-[#4A2956] border-dashed mx-5" />
                            <div>
                                {hasLifePathIndex !== false
                                    ? lifePathStatuses[user?.lifePath - 1]
                                    : "Не указано"}
                            </div>
                        </li>
                    </ul>
                    <div className="mt-[30px]">
                        <h2 className="font-[500] text-lg">О себе</h2>
                        <p className="mt-[5px]">
                            {user?.userInfo || "Не указано"}
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
        </main>
    );
};

export default User;
