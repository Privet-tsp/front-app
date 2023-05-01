import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Table,
    TableHead,
    TableRow,
    TableHeaderCell,
    TableBody,
    TableCell,
    Text,
} from "@tremor/react";
import toast from "react-hot-toast";
import axios from "axios";
import moment from "moment/min/moment-with-locales";

import { Loader } from "../components";

const options = [
    "Спам",
    "Мошенничество",
    "Оскорбления",
    "Откровенное изображение",
    "Проблема с профилем",
];

const statuses = ["Рассматривается", "Отклонено", "Принято"];

const Appeals = () => {
    const [loading, setLoading] = useState(false);
    const [appeals, setAppeals] = useState([]);

    moment.locale("ru");

    useEffect(() => {
        const fetchAppeals = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                if (token) {
                    const { data } = await axios.get("/appeal", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setAppeals(data);
                }
            } catch (error) {
                console.error(error);
                toast.error("Не удалось загрузить список жалоб");
            } finally {
                setLoading(false);
            }
        };
        fetchAppeals();
    }, []);

    const handleUpdateStatus = async (id, key) => {
        try {
            // setLoading(true);
            const token = localStorage.getItem("token");
            if (token) {
                await axios.patch(
                    "/appeal/result/" + id,
                    {
                        statusMode: key,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setAppeals((p) =>
                    p.map((item) =>
                        item._id === id
                            ? {
                                  ...item,
                                  statusMode: key,
                              }
                            : item
                    )
                );
                toast.success("Статус жалобы успешно обновлен");
            }
        } catch (error) {
            console.error(error);
            toast.error("Не удолось обновить статус жалобы");
        } finally {
            // setLoading(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <main className="mt-[150px] text-[#FFFDFD] container mx-auto flex flex-wrap gap-[20px] items-center">
            <div className="w-full">
                <h1 className="ml-4 text-2xl">Список жалоб</h1>
                <Table className="overflow-visible mt-5 w-full border rounded-xl border-gray-200">
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell className="px-4 py-6">
                                Имя пользователя
                            </TableHeaderCell>
                            <TableHeaderCell className="px-4 py-6">
                                Профиль
                            </TableHeaderCell>
                            <TableHeaderCell className="px-4 py-6">
                                Причина
                            </TableHeaderCell>
                            <TableHeaderCell className="px-4 py-6">
                                Статус
                            </TableHeaderCell>
                            <TableHeaderCell className="px-4 py-6">
                                Время
                            </TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className="">
                        {appeals.map((item) => (
                            <TableRow
                                className="border border-gray-200  hover:cursor-pointer"
                                key={item._id}
                            >
                                <TableCell className="capitalize font-bold text-xl flex items-center gap-2">
                                    🥺 {item?.receiver?.userName}
                                </TableCell>
                                <TableCell>
                                    <Link
                                        to={`/profile/${item?.receiver?._id}`}
                                        className="capitalize text-blue-500"
                                    >
                                        Профиль
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <div className="bg-red-500 px-4 py-2 w-fit rounded-full text-white">
                                        {options[item?.reason || 0]}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Menu
                                        as="div"
                                        className="relative inline-block text-left"
                                    >
                                        <div>
                                            <Menu.Button className="inline-flex w-full justify-center rounded-md bg-purple-900 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30">
                                                {
                                                    statuses[
                                                        item?.statusMode || 0
                                                    ]
                                                }
                                            </Menu.Button>
                                        </div>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-right z-[100] divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                <div className="px-1 py-1">
                                                    {statuses.map(
                                                        (status, key) => {
                                                            return (
                                                                <Menu.Item
                                                                    onClick={() => {
                                                                        handleUpdateStatus(
                                                                            item?._id,
                                                                            key
                                                                        );
                                                                    }}
                                                                    key={key}
                                                                >
                                                                    {({
                                                                        active,
                                                                    }) => (
                                                                        <button
                                                                            className={`${
                                                                                active
                                                                                    ? "bg-violet-500 text-white"
                                                                                    : "text-gray-900"
                                                                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                                        >
                                                                            {
                                                                                status
                                                                            }
                                                                        </button>
                                                                    )}
                                                                </Menu.Item>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                </TableCell>
                                <TableCell>
                                    <Text>
                                        {moment(item?.updatedAt).fromNow()}
                                    </Text>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </main>
    );
};

export default Appeals;
