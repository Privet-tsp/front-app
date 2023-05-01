import { useState, Fragment, useEffect } from "react";
import { NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

import { useAuthContext } from "../contexts/authContext";

import { Listbox, Transition } from "@headlessui/react";
// import { CheckIcon } from "@heroicons/react/20/solid";

const months = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
];

export const options = ["Любовь", "Общение", "Друзья"];

const famStatuses = ["Все сложно", "В активном поиске", "Влюблен", "В браке"];

const smokingStatuses = [
    "Резко негативное",
    "Негативное",
    "Компромиссное",
    "Нейтральное",
    "Положительное",
];

const politicalStatuses = [
    "Коммунистические",
    "Социалистические",
    "Умеренные",
    "Либеральные",
    "Консервативные",
    "Монархические",
    "Ультраконсервативные",
    "Индифферентные",
    "Либерталианские",
];

export const lifePathStatuses = [
    "Семья и дети",
    "Карьера и деньги",
    "Развлечения и отдых",
    "Наука и исследования",
    "Совершенствование мира",
    "Саморазвитие",
    "Красота и искусство",
    "Слава и влияние",
];

import profile from "../assets/profile.svg";
import Bookmark from "../assets/bookmark.svg";
import Logout from "../assets/logout.svg";
import Male from "../assets/male.svg";
import Female from "../assets/female.svg";
import ChevronDown from "../assets/chevron-down.svg";

const Profile = () => {
    const [selectedMonth, setSelectedMonth] = useState(months[0]);

    const [searchStatus, setSearchStatus] = useState(options[0]);

    const [famStatus, setFamStatus] = useState(famStatuses[0]);

    const [smoking, setSmoking] = useState(smokingStatuses[0]);

    const [alcohol, setAlcohol] = useState(smokingStatuses[0]);

    const [political, setPolitical] = useState(politicalStatuses[0]);

    const [lifePath, setLifePath] = useState(lifePathStatuses[0]);

    const [date, setDate] = useState({
        day: "1",
        month: "1",
        year: 1900,
    });

    const { setUser, user } = useAuthContext();

    const [formState, setFormState] = useState({
        email: user?.email,
        avatarUrl: user?.avatarUrl,
        userName: user?.userName,
        userInfo: "",
        profileStatus: true,
        gender: 1,
        findGender: 2,
        location: "",
        education: "",
        profession: "",
        userHeight: "",
        children: "",
        hobby: "",
    });

    const handleChange = (e) => {
        setFormState({
            ...formState,
            [e.target.name]:
                e.target.type === "checkbox"
                    ? e.target.checked
                    : e.target.value,
        });
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    const { data } = await axios.get("/profile/" + user?._id, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setFormState({
                        ...formState,
                        children: data?.children || 0,
                        userInfo: data?.userInfo || "",
                        profileStatus: data?.profileStatus ?? true,
                        gender: data?.gender || 1,
                        findGender: data?.findGender || 2,
                        location: data?.location || "",
                        education: data?.education || "",
                        profession: data?.profession || "",
                        userHeight: data?.userHeight || "",
                        hobby: data?.hobby || "",
                    });
                    if (data?.famStatus) {
                        setFamStatus(famStatuses[data.famStatus - 1]);
                    }
                    if (data?.lifePath) {
                        setLifePath(lifePathStatuses[data.lifePath - 1]);
                    }
                    if (data?.searchStatus) {
                        setSearchStatus(options[data.searchStatus - 1]);
                    }
                    if (data?.smoking) {
                        setSmoking(smokingStatuses[data.smoking - 1]);
                    }
                    if (data?.alcohol) {
                        setAlcohol(smokingStatuses[data.alcohol - 1]);
                    }
                    if (data?.political) {
                        setPolitical(politicalStatuses[data.political - 1]);
                    }
                    if (data?.bday) {
                        const d = new Date(data.bday);
                        setDate({
                            day: d.getDate(),
                            month: d.getMonth(),
                            year: d.getFullYear(),
                        });
                        setSelectedMonth(months[d.getMonth()]);
                    }
                }
            } catch (error) {
                console.log(error);
                toast.error("Ошибка при обновлении профиля");
            }
        };
        fetchProfile();
    }, []);

    const handleLogout = () => {
        localStorage.setItem("token", "");
        setUser(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            if (token) {
                const { data } = await axios.put(
                    "/edit",
                    {
                        ...formState,
                        lifePath:
                            lifePathStatuses.findIndex(
                                (item) => item === lifePath
                            ) + 1,
                        famStatus:
                            famStatuses.findIndex(
                                (item) => item === famStatus
                            ) + 1,
                        searchStatus:
                            options.findIndex((item) => item === searchStatus) +
                            1,
                        smoking:
                            smokingStatuses.findIndex(
                                (item) => item === smoking
                            ) + 1,
                        political:
                            politicalStatuses.findIndex(
                                (item) => item === political
                            ) + 1,
                        alcohol:
                            smokingStatuses.findIndex(
                                (item) => item === alcohol
                            ) + 1,
                        bday: new Date(
                            date.year,
                            months.findIndex((item) => item === selectedMonth),
                            date.day
                        ),
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                toast.success("Данные успешно изменены");
                const res = await axios.get("/auth/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(res.data);
            }
        } catch (error) {
            console.log(error);
            toast.error("Ошибка при обновлении профиля");
        }
    };

    return (
        <main className="container mt-[120px] mx-auto flex items-center flex-col lg:flex-row lg:items-start py-[30px] gap-5">
            <div className="bg-[#1C0A22] flex flex-col gap-5 rounded-[30px] py-[30px] w-[280px] flex-shrink-0 text-white">
                <NavLink
                    className="px-[30px] inline-flex items-center gap-5"
                    to="/profile"
                >
                    <img src={profile} />
                    Профиль
                </NavLink>
                <span className="px-[30px] cursor-pointer inline-flex items-center gap-5">
                    <img src={Bookmark} /> Избранное
                </span>
                <span
                    className="px-[30px] mt-[50px] cursor-pointer inline-flex items-center gap-5"
                    onClick={handleLogout}
                >
                    <img src={Logout} />
                    Выйти
                </span>
            </div>
            <section className="flex flex-col gap-5 w-full items-center lg:items-start">
                <h1 className="text-[28px] font-[500]">Профиль</h1>
                <div className="flex flex-col lg:flex-row gap-5 lg:items-start w-full">
                    <div className="w-[280px] mx-auto lg:mx-0 flex-shrink-0 rounded-[50px] overflow-hidden">
                        <img
                            src={
                                user?.avatarUrl ||
                                "https://avatars.githubusercontent.com/u/75017126?s=400&u=a6b4a1e2a8cd3ea3faea7a86570f019b1f04c6fe&v=4"
                            }
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6 px-4 lg:px-0 w-full"
                    >
                        <h2 className="font-medium text-lg text-center lg:text-left">
                            Основная информация
                        </h2>
                        <div className="flex items-center justify-between">
                            <label htmlFor="userName">Имя</label>
                            <div className="w-[300px] lg:w-[380px] h-[70px] bg-[#42204E] rounded-[500px] flex items-center px-[30px]">
                                <input
                                    autoComplete="off"
                                    value={formState.userName}
                                    onChange={handleChange}
                                    type="text"
                                    id="userName"
                                    name="userName"
                                    className="text-white placeholder:text-[#8B5D9A] outline-none border-none capitalize bg-transparent w-full"
                                    placeholder="Ваше имя"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="email">E-mail</label>
                            <div className="w-[300px] lg:w-[380px] h-[70px] bg-[#42204E] rounded-[500px] flex items-center px-[30px]">
                                <input
                                    autoComplete="off"
                                    type="email"
                                    value={formState.email}
                                    onChange={handleChange}
                                    id="email"
                                    name="email"
                                    className="text-white placeholder:text-[#8B5D9A] outline-none border-none bg-transparent w-full"
                                    placeholder="Введите e-mail"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="avatarUrl">Фотография</label>
                            <div className="w-[300px] lg:w-[380px] h-[70px] bg-[#42204E] rounded-[500px] flex items-center px-[30px]">
                                <input
                                    autoComplete="off"
                                    type="text"
                                    value={formState.avatarUrl}
                                    onChange={handleChange}
                                    id="avatarUrl"
                                    name="avatarUrl"
                                    className="text-white placeholder:text-[#8B5D9A] outline-none border-none bg-transparent w-full"
                                    placeholder="Ссылка на фотографию"
                                />
                            </div>
                        </div>

                        <div className="flex items-start justify-between">
                            <label htmlFor="userInfo">О себе</label>
                            <textarea
                                type="text"
                                rows={4}
                                value={formState.userInfo}
                                onChange={handleChange}
                                id="userInfo"
                                name="userInfo"
                                className="text-white placeholder:text-[#8B5D9A] outline-none border-none w-[300px] lg:w-[380px] bg-[#42204E] rounded-[30px] px-[30px] py-[24px]"
                                placeholder="Расскажите о себе"
                                style={{ resize: "none" }}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <label>Статус профиля</label>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    name="profileStatus"
                                    type="checkbox"
                                    checked={formState.profileStatus}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#42204E]"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between">
                            <label>Пол</label>
                            <div className="flex items-center gap-[10px]">
                                <div
                                    onClick={() =>
                                        setFormState({
                                            ...formState,
                                            gender: 1,
                                        })
                                    }
                                    className={`w-[140px] lg:w-[180px] h-[70px] rounded-full flex bg-gradient-to-r from-[#0575E6] to-[#021B79] p-[1px] cursor-pointer ${
                                        formState.gender === 1 &&
                                        "male-selected"
                                    }`}
                                >
                                    <div
                                        className={`h-full w-full flex items-center justify-center bg-[#230E2B] rounded-full ${
                                            formState.gender === 1 &&
                                            "bg-transparent"
                                        }`}
                                    >
                                        <img src={Male} />
                                    </div>
                                </div>
                                <div
                                    onClick={() =>
                                        setFormState({
                                            ...formState,
                                            gender: 2,
                                        })
                                    }
                                    className={`w-[140px] lg:w-[180px] h-[70px] rounded-full flex bg-gradient-to-r from-[#EC008C] to-[#FC6767] p-[1px] cursor-pointer ${
                                        formState.gender === 2 &&
                                        "female-selected"
                                    }`}
                                >
                                    <div
                                        className={`h-full w-full flex items-center justify-center bg-[#230E2B] rounded-full ${
                                            formState.gender === 2 &&
                                            "bg-transparent"
                                        }`}
                                    >
                                        <img src={Female} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <label>Кто интересен</label>
                            <div className="flex items-center gap-[10px]">
                                <div
                                    onClick={() =>
                                        setFormState({
                                            ...formState,
                                            findGender: 1,
                                        })
                                    }
                                    className={`w-[140px] lg:w-[180px] h-[70px] rounded-full flex bg-gradient-to-r from-[#0575E6] to-[#021B79] p-[1px] cursor-pointer ${
                                        formState.findGender === 1 &&
                                        "male-selected"
                                    }`}
                                >
                                    <div
                                        className={`h-full w-full flex items-center justify-center bg-[#230E2B] rounded-full ${
                                            formState.findGender === 1 &&
                                            "bg-transparent"
                                        }`}
                                    >
                                        <img src={Male} />
                                    </div>
                                </div>
                                <div
                                    onClick={() =>
                                        setFormState({
                                            ...formState,
                                            findGender: 2,
                                        })
                                    }
                                    className={`w-[140px] lg:w-[180px] h-[70px] rounded-full flex bg-gradient-to-r from-[#EC008C] to-[#FC6767] p-[1px] cursor-pointer ${
                                        formState.findGender === 2 &&
                                        "female-selected"
                                    }`}
                                >
                                    <div
                                        className={`h-full w-full flex items-center justify-center bg-[#230E2B] rounded-full ${
                                            formState.findGender === 2 &&
                                            "bg-transparent"
                                        }`}
                                    >
                                        <img src={Female} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <label>Дата рождения</label>
                            <div className="flex items-center gap-[5px]">
                                <div className="w-[100px] h-[70px] bg-[#42204E] rounded-[500px] flex items-center px-[30px]">
                                    <input
                                        autoComplete="off"
                                        type="text"
                                        id="day"
                                        value={date.day}
                                        onChange={(e) => {
                                            setDate({
                                                ...date,
                                                day: e.target.value,
                                            });
                                        }}
                                        name="day"
                                        min={31}
                                        className="text-white placeholder:text-[#8B5D9A] outline-none border-none bg-transparent w-full"
                                        placeholder="День"
                                    />
                                </div>
                                <Listbox
                                    value={selectedMonth}
                                    onChange={setSelectedMonth}
                                >
                                    {({ open }) => (
                                        <div className="relative mt-1">
                                            <Listbox.Button className="relative w-[170px] h-[70px] cursor-default bg-[#42204E] rounded-full flex items-center justify-between px-[30px]">
                                                <span className="block truncate">
                                                    {selectedMonth}
                                                </span>
                                                <img
                                                    className={`transition duration-300 ${
                                                        !open && "rotate-180"
                                                    }`}
                                                    src={ChevronDown}
                                                />
                                            </Listbox.Button>
                                            <Transition
                                                as={Fragment}
                                                leave="transition ease-in duration-100"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                            >
                                                <Listbox.Options className="absolute z-2 mt-1 max-h-60 w-full overflow-auto rounded-md bg-[#42204E] py-1 text-base text-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                    {months.map(
                                                        (month, personIdx) => (
                                                            <Listbox.Option
                                                                key={personIdx}
                                                                className={({
                                                                    active,
                                                                }) =>
                                                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                                        active
                                                                            ? "bg-purple-400"
                                                                            : "text-white"
                                                                    }`
                                                                }
                                                                value={month}
                                                            >
                                                                {({
                                                                    selected,
                                                                }) => (
                                                                    <>
                                                                        <span
                                                                            className={`block truncate ${
                                                                                selected
                                                                                    ? "font-medium"
                                                                                    : "font-normal"
                                                                            }`}
                                                                        >
                                                                            {
                                                                                month
                                                                            }
                                                                        </span>
                                                                        {selected ? (
                                                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
                                                                                {/* <CheckIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      /> */}
                                                                            </span>
                                                                        ) : null}
                                                                    </>
                                                                )}
                                                            </Listbox.Option>
                                                        )
                                                    )}
                                                </Listbox.Options>
                                            </Transition>
                                        </div>
                                    )}
                                </Listbox>
                                <div className="w-[100px] h-[70px] bg-[#42204E] rounded-[500px] flex items-center px-[30px]">
                                    <input
                                        autoComplete="off"
                                        type="number"
                                        value={date.year}
                                        onChange={(e) => {
                                            setDate({
                                                ...date,
                                                year: e.target.value,
                                            });
                                        }}
                                        max={new Date().getFullYear() - 18}
                                        id="year"
                                        name="year"
                                        className="text-white placeholder:text-[#8B5D9A] outline-none border-none bg-transparent w-full"
                                        placeholder="Год"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="location">Место жительства</label>
                            <div className="w-[300px] lg:w-[380px] h-[70px] bg-[#42204E] rounded-[500px] flex items-center px-[30px]">
                                <input
                                    autoComplete="off"
                                    value={formState.location}
                                    onChange={handleChange}
                                    type="text"
                                    id="location"
                                    name="location"
                                    className="text-white placeholder:text-[#8B5D9A] outline-none border-none bg-transparent w-full"
                                    placeholder="Место жительства"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="education">Образование</label>
                            <div className="w-[300px] lg:w-[380px] h-[70px] bg-[#42204E] rounded-[500px] flex items-center px-[30px]">
                                <input
                                    autoComplete="off"
                                    type="text"
                                    id="education"
                                    value={formState.education}
                                    onChange={handleChange}
                                    name="education"
                                    className="text-white placeholder:text-[#8B5D9A] outline-none border-none bg-transparent w-full"
                                    placeholder="Образование"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="profession">Профессия</label>
                            <div className="w-[300px] lg:w-[380px] h-[70px] bg-[#42204E] rounded-[500px] flex items-center px-[30px]">
                                <input
                                    autoComplete="off"
                                    type="text"
                                    value={formState.profession}
                                    onChange={handleChange}
                                    id="profession"
                                    name="profession"
                                    className="text-white placeholder:text-[#8B5D9A] outline-none border-none bg-transparent w-full"
                                    placeholder="Профессия"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <label>Цель знакомства</label>
                            <div className="flex items-center gap-[5px]">
                                <Listbox
                                    value={searchStatus}
                                    onChange={setSearchStatus}
                                >
                                    {({ open }) => (
                                        <div className="relative mt-1">
                                            <Listbox.Button className="relative w-[300px] lg:w-[380px] h-[70px] cursor-default bg-[#42204E] rounded-full flex items-center justify-between px-[30px]">
                                                <span className="block truncate">
                                                    {searchStatus}
                                                </span>
                                                <img
                                                    className={`transition duration-300 ${
                                                        !open && "rotate-180"
                                                    }`}
                                                    src={ChevronDown}
                                                />
                                            </Listbox.Button>
                                            <Transition
                                                as={Fragment}
                                                leave="transition ease-in duration-100"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                            >
                                                <Listbox.Options className="absolute z-[2] mt-1 max-h-60 w-full overflow-auto rounded-md bg-[#42204E] py-1 text-base text-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                    {options.map(
                                                        (option, personIdx) => (
                                                            <Listbox.Option
                                                                key={personIdx}
                                                                className={({
                                                                    active,
                                                                }) =>
                                                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                                        active
                                                                            ? "bg-purple-400"
                                                                            : "text-white"
                                                                    }`
                                                                }
                                                                value={option}
                                                            >
                                                                {({
                                                                    selected,
                                                                }) => (
                                                                    <>
                                                                        <span
                                                                            className={`block truncate ${
                                                                                selected
                                                                                    ? "font-medium"
                                                                                    : "font-normal"
                                                                            }`}
                                                                        >
                                                                            {
                                                                                option
                                                                            }
                                                                        </span>
                                                                        {selected ? (
                                                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
                                                                                {/* <CheckIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      /> */}
                                                                            </span>
                                                                        ) : null}
                                                                    </>
                                                                )}
                                                            </Listbox.Option>
                                                        )
                                                    )}
                                                </Listbox.Options>
                                            </Transition>
                                        </div>
                                    )}
                                </Listbox>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <label>Семейное положение</label>
                            <div className="flex items-center gap-[5px]">
                                <Listbox
                                    value={famStatus}
                                    onChange={setFamStatus}
                                >
                                    {({ open }) => (
                                        <div className="relative mt-1">
                                            <Listbox.Button className="relative w-[300px] lg:w-[380px] h-[70px] cursor-default bg-[#42204E] rounded-full flex items-center justify-between px-[30px]">
                                                <span className="block truncate">
                                                    {famStatus}
                                                </span>
                                                <img
                                                    className={`transition duration-300 ${
                                                        !open && "rotate-180"
                                                    }`}
                                                    src={ChevronDown}
                                                />
                                            </Listbox.Button>
                                            <Transition
                                                as={Fragment}
                                                leave="transition ease-in duration-100"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                            >
                                                <Listbox.Options className="absolute z-[2] mt-1 max-h-60 w-full overflow-auto rounded-md bg-[#42204E] py-1 text-base text-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                    {famStatuses.map(
                                                        (option, personIdx) => (
                                                            <Listbox.Option
                                                                key={personIdx}
                                                                className={({
                                                                    active,
                                                                }) =>
                                                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                                        active
                                                                            ? "bg-purple-400"
                                                                            : "text-white"
                                                                    }`
                                                                }
                                                                value={option}
                                                            >
                                                                {({
                                                                    selected,
                                                                }) => (
                                                                    <>
                                                                        <span
                                                                            className={`block truncate ${
                                                                                selected
                                                                                    ? "font-medium"
                                                                                    : "font-normal"
                                                                            }`}
                                                                        >
                                                                            {
                                                                                option
                                                                            }
                                                                        </span>
                                                                        {selected ? (
                                                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
                                                                                {/* <CheckIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      /> */}
                                                                            </span>
                                                                        ) : null}
                                                                    </>
                                                                )}
                                                            </Listbox.Option>
                                                        )
                                                    )}
                                                </Listbox.Options>
                                            </Transition>
                                        </div>
                                    )}
                                </Listbox>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="userHeight">Рост</label>
                            <div className="w-[300px] lg:w-[380px] h-[70px] bg-[#42204E] rounded-[500px] flex items-center px-[30px]">
                                <input
                                    autoComplete="off"
                                    type="number"
                                    value={formState.userHeight}
                                    onChange={handleChange}
                                    id="userHeight"
                                    min={60}
                                    name="userHeight"
                                    className="text-white placeholder:text-[#8B5D9A] outline-none border-none bg-transparent w-full"
                                    placeholder="Ваш рост"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <label>Отношение к курению</label>
                            <div className="flex items-center gap-[5px]">
                                <Listbox value={smoking} onChange={setSmoking}>
                                    {({ open }) => (
                                        <div className="relative mt-1">
                                            <Listbox.Button className="relative w-[300px] lg:w-[380px] h-[70px] cursor-default bg-[#42204E] rounded-full flex items-center justify-between px-[30px]">
                                                <span className="block truncate">
                                                    {smoking}
                                                </span>
                                                <img
                                                    className={`transition duration-300 ${
                                                        !open && "rotate-180"
                                                    }`}
                                                    src={ChevronDown}
                                                />
                                            </Listbox.Button>
                                            <Transition
                                                as={Fragment}
                                                leave="transition ease-in duration-100"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                            >
                                                <Listbox.Options className="absolute z-[2] mt-1 max-h-60 w-full overflow-auto rounded-md bg-[#42204E] py-1 text-base text-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                    {smokingStatuses.map(
                                                        (option, personIdx) => (
                                                            <Listbox.Option
                                                                key={personIdx}
                                                                className={({
                                                                    active,
                                                                }) =>
                                                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                                        active
                                                                            ? "bg-purple-400"
                                                                            : "text-white"
                                                                    }`
                                                                }
                                                                value={option}
                                                            >
                                                                {({
                                                                    selected,
                                                                }) => (
                                                                    <>
                                                                        <span
                                                                            className={`block truncate ${
                                                                                selected
                                                                                    ? "font-medium"
                                                                                    : "font-normal"
                                                                            }`}
                                                                        >
                                                                            {
                                                                                option
                                                                            }
                                                                        </span>
                                                                        {selected ? (
                                                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
                                                                                {/* <CheckIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      /> */}
                                                                            </span>
                                                                        ) : null}
                                                                    </>
                                                                )}
                                                            </Listbox.Option>
                                                        )
                                                    )}
                                                </Listbox.Options>
                                            </Transition>
                                        </div>
                                    )}
                                </Listbox>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <label>Отношение к алкоголю</label>
                            <div className="flex items-center gap-[5px]">
                                <Listbox value={alcohol} onChange={setAlcohol}>
                                    {({ open }) => (
                                        <div className="relative mt-1">
                                            <Listbox.Button className="relative w-[300px] lg:w-[380px] h-[70px] cursor-default bg-[#42204E] rounded-full flex items-center justify-between px-[30px]">
                                                <span className="block truncate">
                                                    {alcohol}
                                                </span>
                                                <img
                                                    className={`transition duration-300 ${
                                                        !open && "rotate-180"
                                                    }`}
                                                    src={ChevronDown}
                                                />
                                            </Listbox.Button>
                                            <Transition
                                                as={Fragment}
                                                leave="transition ease-in duration-100"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                            >
                                                <Listbox.Options className="absolute z-[2] mt-1 max-h-60 w-full overflow-auto rounded-md bg-[#42204E] py-1 text-base text-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                    {smokingStatuses.map(
                                                        (option, personIdx) => (
                                                            <Listbox.Option
                                                                key={personIdx}
                                                                className={({
                                                                    active,
                                                                }) =>
                                                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                                        active
                                                                            ? "bg-purple-400"
                                                                            : "text-white"
                                                                    }`
                                                                }
                                                                value={option}
                                                            >
                                                                {({
                                                                    selected,
                                                                }) => (
                                                                    <>
                                                                        <span
                                                                            className={`block truncate ${
                                                                                selected
                                                                                    ? "font-medium"
                                                                                    : "font-normal"
                                                                            }`}
                                                                        >
                                                                            {
                                                                                option
                                                                            }
                                                                        </span>
                                                                        {selected ? (
                                                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
                                                                                {/* <CheckIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      /> */}
                                                                            </span>
                                                                        ) : null}
                                                                    </>
                                                                )}
                                                            </Listbox.Option>
                                                        )
                                                    )}
                                                </Listbox.Options>
                                            </Transition>
                                        </div>
                                    )}
                                </Listbox>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <label>Политические взляды</label>
                            <div className="flex items-center gap-[5px]">
                                <Listbox
                                    value={political}
                                    onChange={setPolitical}
                                >
                                    {({ open }) => (
                                        <div className="relative mt-1">
                                            <Listbox.Button className="relative w-[300px] lg:w-[380px] h-[70px] cursor-default bg-[#42204E] rounded-full flex items-center justify-between px-[30px]">
                                                <span className="block truncate">
                                                    {political}
                                                </span>
                                                <img
                                                    className={`transition duration-300 ${
                                                        !open && "rotate-180"
                                                    }`}
                                                    src={ChevronDown}
                                                />
                                            </Listbox.Button>
                                            <Transition
                                                as={Fragment}
                                                leave="transition ease-in duration-100"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                            >
                                                <Listbox.Options className="absolute z-[2] mt-1 max-h-60 w-full overflow-auto rounded-md bg-[#42204E] py-1 text-base text-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                    {politicalStatuses.map(
                                                        (option, personIdx) => (
                                                            <Listbox.Option
                                                                key={personIdx}
                                                                className={({
                                                                    active,
                                                                }) =>
                                                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                                        active
                                                                            ? "bg-purple-400"
                                                                            : "text-white"
                                                                    }`
                                                                }
                                                                value={option}
                                                            >
                                                                {({
                                                                    selected,
                                                                }) => (
                                                                    <>
                                                                        <span
                                                                            className={`block truncate ${
                                                                                selected
                                                                                    ? "font-medium"
                                                                                    : "font-normal"
                                                                            }`}
                                                                        >
                                                                            {
                                                                                option
                                                                            }
                                                                        </span>
                                                                        {selected ? (
                                                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
                                                                                {/* <CheckIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      /> */}
                                                                            </span>
                                                                        ) : null}
                                                                    </>
                                                                )}
                                                            </Listbox.Option>
                                                        )
                                                    )}
                                                </Listbox.Options>
                                            </Transition>
                                        </div>
                                    )}
                                </Listbox>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <label>Главное в жизни</label>
                            <div className="flex items-center gap-[5px]">
                                <Listbox
                                    value={lifePath}
                                    onChange={setLifePath}
                                >
                                    {({ open }) => (
                                        <div className="relative mt-1">
                                            <Listbox.Button className="relative w-[300px] lg:w-[380px] h-[70px] cursor-default bg-[#42204E] rounded-full flex items-center justify-between px-[30px]">
                                                <span className="block truncate">
                                                    {lifePath}
                                                </span>
                                                <img
                                                    className={`transition duration-300 ${
                                                        !open && "rotate-180"
                                                    }`}
                                                    src={ChevronDown}
                                                />
                                            </Listbox.Button>
                                            <Transition
                                                as={Fragment}
                                                leave="transition ease-in duration-100"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                            >
                                                <Listbox.Options className="absolute z-[2] mt-1 max-h-60 w-full overflow-auto rounded-md bg-[#42204E] py-1 text-base text-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                    {lifePathStatuses.map(
                                                        (option, personIdx) => (
                                                            <Listbox.Option
                                                                key={personIdx}
                                                                className={({
                                                                    active,
                                                                }) =>
                                                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                                        active
                                                                            ? "bg-purple-400"
                                                                            : "text-white"
                                                                    }`
                                                                }
                                                                value={option}
                                                            >
                                                                {({
                                                                    selected,
                                                                }) => (
                                                                    <>
                                                                        <span
                                                                            className={`block truncate ${
                                                                                selected
                                                                                    ? "font-medium"
                                                                                    : "font-normal"
                                                                            }`}
                                                                        >
                                                                            {
                                                                                option
                                                                            }
                                                                        </span>
                                                                        {selected ? (
                                                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
                                                                                {/* <CheckIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      /> */}
                                                                            </span>
                                                                        ) : null}
                                                                    </>
                                                                )}
                                                            </Listbox.Option>
                                                        )
                                                    )}
                                                </Listbox.Options>
                                            </Transition>
                                        </div>
                                    )}
                                </Listbox>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="hobby">Хобби</label>
                            <div className="w-[300px] lg:w-[380px] h-[70px] bg-[#42204E] rounded-[500px] flex items-center px-[30px]">
                                <input
                                    autoComplete="off"
                                    type="text"
                                    id="hobby"
                                    value={formState.hobby}
                                    onChange={handleChange}
                                    name="hobby"
                                    className="text-white placeholder:text-[#8B5D9A] outline-none border-none bg-transparent w-full"
                                    placeholder="Хобби"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="children">Дети</label>
                            <div className="w-[300px] lg:w-[380px] h-[70px] bg-[#42204E] rounded-[500px] flex items-center px-[30px]">
                                <input
                                    autoComplete="off"
                                    type="number"
                                    value={formState.children}
                                    onChange={handleChange}
                                    min={0}
                                    id="children"
                                    name="children"
                                    className="text-white placeholder:text-[#8B5D9A] outline-none border-none bg-transparent w-full"
                                    placeholder="Дети"
                                />
                            </div>
                        </div>
                        <div className="w-full flex justify-end">
                            <button
                                type="submit"
                                className="w-[250px] h-[70px] rounded-full text-white gradient-btn-submit"
                            >
                                Сохранить
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    );
};

export default Profile;
