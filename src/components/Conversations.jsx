import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import toast from "react-hot-toast";
import axios from "axios";

import Send from "../assets/send.svg";
import { useAuthContext } from "../contexts/authContext";

const Conversations = ({ isOpen, setIsOpen }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const [matches, setMatches] = useState([]);

  const [messages, setMessages] = useState([]);

  const [activeMatch, setActiveMatch] = useState(null);

  const [text, setText] = useState("");

  const { user } = useAuthContext();

  const navigate = useNavigate();

  const closeModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      const fetchMatches = async () => {
        try {
          const token = localStorage.getItem("token");
          if (token) {
            const { data } = await axios.get("/matches", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setMatches(data);
          }
        } catch (error) {
          console.log(error);
          toast.error("Ошибка при загрузке диалогов");
        }
      };
      fetchMatches();
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (activeIndex && isOpen) {
        setActiveMatch(matches.find((match) => match._id === activeIndex));
        try {
          const token = localStorage.getItem("token");
          if (token) {
            const { data } = await axios.get(`/message/view/${activeIndex}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setMessages(data);
          }
        } catch (error) {
          console.log(error);
          toast.error("Ошибка при загрузке сообщений");
        }
      }
    };
    fetchMessages();
  }, [activeIndex, isOpen]);

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const { data } = await axios.post(
          "/message/new/" + activeIndex,
          {
            text,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessages((p) => [data, ...p]);
        setText("");
      }
    } catch (error) {
      console.log(error);
      toast.error("Не удалось отправить сообщение");
    }
  };

  const otherDude =
    user?._id === activeMatch?.user2?._id
      ? activeMatch?.user1
      : activeMatch?.user2;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-[930px] h-[628px] transform overflow-hidden rounded-[50px] bg-[#1C0A22] text-white shadow-xl transition-all flex justify-between">
                {matches.length === 0 ? (
                  <div className="px-[40px] h-full flex items-center text-4xl py-[40px]">
                    Пока что список диалогов пуст 😢
                  </div>
                ) : (
                  <ul className="px-[20px] py-[40px] space-y-[10px] overflow-y-scroll">
                    {matches.map((match) => {
                      const otherDude =
                        user?._id === match?.user2?._id
                          ? match?.user1
                          : match?.user2;

                      const handleClick = (e) => {
                        if (e.type === "click") {
                          setActiveIndex(match._id);
                        } else if (e.type === "contextmenu") {
                          closeModal();
                          navigate("/profile/" + otherDude?._id);
                        }
                      };

                      return (
                        <li
                          key={match._id}
                          tabIndex={0}
                          onClick={handleClick}
                          onContextMenu={handleClick}
                          className={`h-[90px] w-[360px] ${
                            match._id === activeIndex
                              ? "dark-gradient"
                              : "transparent"
                          } rounded-full flex items-center gap-[20px] py-[10px] px-[30px] cursor-pointer`}
                        >
                          <div className="w-[70px] h-[70px] overflow-hidden rounded-full">
                            <img
                              src={otherDude?.avatarUrl}
                              alt="avatar"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="space-y-[5px] text-left">
                            <h2 className="text-base capitalize font-medium">
                              {otherDude?.userName}
                            </h2>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
                <div className="w-[528px] p-[50px] h-full bg-[#2A1332] rounded-[50px] flex flex-col justify-between">
                  {activeIndex === null ? (
                    <div className="h-full w-full flex items-center text-2xl">
                      Выберите диалог для просмотра сообщений
                    </div>
                  ) : (
                    <>
                      <div className="h-full flex flex-col">
                        <h2 className="text-base font-medium text-left mb-[20px]">
                          {otherDude?.userName}{" "}
                          {otherDude?.bday &&
                            moment(new Date()).diff(otherDude?.bday, "years")}
                        </h2>
                        <ul className="h-[0] flex-grow overflow-y-scroll flex flex-col-reverse gap-[20px]">
                          {messages.length === 0 ? (
                            <li className="h-full w-full flex items-center justify-center text-center text-2xl">
                              Пока тут пусто. Напиши первым 😌
                            </li>
                          ) : (
                            messages.map((message, index) => {
                              return (
                                <li
                                  key={index}
                                  className={`flex gap-[10px] ${
                                    message.sender === user?._id
                                      ? "flex-row-reverse"
                                      : ""
                                  }`}
                                >
                                  <div className="w-[40px] h-[40px] flex-shrink-0 rounded-full overflow-hidden">
                                    <img
                                      src={
                                        message.sender === user?._id
                                          ? user.avatarUrl
                                          : otherDude?.avatarUrl
                                      }
                                      className="w-full h-full object-cover"
                                      alt="avatar"
                                    />
                                  </div>
                                  <div
                                    className={`py-[10px] px-[20px] rounded-[50px] ${
                                      message.sender === user?._id
                                        ? "message-gradient-blue rounded-tr-[0px] text-right"
                                        : "message-gradient rounded-tl-[0px] text-left"
                                    }`}
                                  >
                                    {message.text}
                                  </div>
                                </li>
                              );
                            })
                          )}
                        </ul>
                      </div>
                      <form
                        onSubmit={sendMessage}
                        className="py-[18px] mt-4 px-[30px] flex bg-[#42204E] rounded-full"
                      >
                        <input
                          type="text"
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          placeholder="Написать сообщение..."
                          className="bg-transparent outline-none border-none flex-grow placeholder:text-[#8B5D9A]"
                        />
                        <button
                          type="submit"
                          className="bg-none outline-none border-none"
                        >
                          <img
                            className="cursor-pointer"
                            src={Send}
                            alt="send"
                          />
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
export default Conversations;
