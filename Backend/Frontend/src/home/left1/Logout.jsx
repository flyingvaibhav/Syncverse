import React, { useState } from "react";
import { TbLogout2 } from "react-icons/tb";
import axios from "axios";
import toast from "react-hot-toast";

function Logout({ setAuthUser }) {
  const [loading, setLoading] = useState(false);
  const handleLogout = async () => {
    try {
      await axios.post("/api/user/logout", {}, { withCredentials: true });
      setAuthUser(null);
      localStorage.removeItem("ChatApp");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };
  return (
    <>
      <div className="w-[4%]   bg-slate-680 text-white  flex flex-col justify-end ">
        <div className="p-3  align-bottom ">
          <button>
            <TbLogout2
              className="text-5xl p-2 hover:bg-gray-600 rounded-lg duration-300"
              onClick={handleLogout}
            />
          </button>
        </div>
      </div>
    </>
  );
}
export default Logout;