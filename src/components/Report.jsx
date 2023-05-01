import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { BiChevronRight } from "react-icons/bi";
import toast from "react-hot-toast";
import axios from "axios";

const options = [
  "Спам",
  "Мошенничество",
  "Оскорбления",
  "Откровенное изображение",
  "Проблема с профилем",
];

import { useReportContext } from "../contexts";

const Report = () => {
  const { isOpen, setIsOpen, reportUser, setReportUser } = useReportContext();

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleReport = async (option) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post(
          "/appeal/new/" + reportUser?._id,
          {
            reason: option,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Жалоба успешно отправлена");
      }
    } catch (error) {
      console.log(error);
      toast.error("Что-то пошло не так...");
    } finally {
      setReportUser(null);
      setIsOpen(false);
    }
  };
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
              <Dialog.Panel className="w-[450px] transform overflow-hidden rounded-xl bg-[#1C0A22] text-white shadow-xl transition-all pb-12 flex flex-col items-center relative">
                <button
                  onClick={closeModal}
                  className="absolute right-4 top-4 text-3xl"
                >
                  <IoCloseOutline />
                </button>
                <div className="p-8 mt-8 w-full">
                  <div className="p-4 border border-gray-300 rounded-lg flex justify-between items-center w-full">
                    <div className="text-left">
                      <h1 className="capitalize">{reportUser?.userName}</h1>
                      <p className="text-xs text-gray-300">Профиль</p>
                    </div>
                    <div className="w-[80px] h-[80px] rounded-full overflow-hidden">
                      <img
                        className="h-full w-full"
                        src={reportUser?.avatarUrl}
                        alt="Avatar"
                      />
                    </div>
                  </div>
                </div>
                <h2 className="text-sm mb-2 w-full px-8 text-left">
                  Что вам кажется недопустимым на странице{" "}
                  <span className="capitalize">{reportUser?.userName}?</span>
                </h2>
                {options.map((option, index) => (
                  <div
                    key={index}
                    role="button"
                    className={`px-8 text-gray-200 w-full flex flex-col ${
                      index > 0 ? "-mt-[1px]" : ""
                    }`}
                    onClick={() => handleReport(index)}
                  >
                    <div className="py-3 group hover:opacity-80 transition cursor-pointer border-t border-b border-t-transparent border-b-gray-200 hover:border-t-gray-200 flex items-center justify-between hover:-mx-8 hover:px-8">
                      <span className="text-sm">{option}</span>
                      <BiChevronRight className="text-2xl group-hover:translate-x-1 transition" />
                    </div>
                  </div>
                ))}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
export default Report;
