import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import moment from "moment";

import { Loader } from "../components";
import Hi from "../assets/hi.svg";

const All = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (token) {
          const { data } = await axios.get("/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUsers(data);
        }
      } catch (error) {
        console.error(error);
        toast.error("Не удалось загрузить пользователей");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <Loader />;
  return (
    <main className="mt-[150px] text-[#FFFDFD] container mx-auto flex flex-wrap gap-[20px] items-center">
      {users.map((user, index) => (
        <div
          onClick={() => navigate("/profile/" + user?._id)}
          key={index}
          className="w-[220px] h-[350px] rounded-[30px] relative overflow-hidden cursor-pointer"
        >
          <div className="absolute inset-0 bg-black/30"></div>
          <img src={user?.avatarUrl} className="h-full w-full" />
          <div className="absolute left-6 bottom-[70px]">
            <h1 className="text-base capitalize font-[500]">
              {user?.userName}{" "}
              {user?.bday &&
                moment(new Date()).diff(new Date(user?.bday), "years")}
            </h1>
            <span className="online w-[14px] h-[14px] absolute -right-1 translate-x-[100%] top-0 rounded-full" />
          </div>
          <button className="absolute z-10 bottom-0 left-0 right-0 py-[14px] px-[30px] text-sm font-medium rounded-[40px] gradient-btn-submit flex items-center gap-[10px]">
            Открыть профиль
            <img src={Hi} className="w-6" />
          </button>
        </div>
      ))}
    </main>
  );
};

export default All;
