import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import AdminContext from "../context/AdminContext";
import DoctorContext from "../context/DoctorContext";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ NEW: show / hide password
  const [showPassword, setShowPassword] = useState(false);

  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const url = state === "Admin" ? "admin" : "doctor";
    const tokenKey = state === "Admin" ? "aToken" : "dToken";
    const setToken = state === "Admin" ? setAToken : setDToken;
    const role = state === "Admin" ? "admin" : "doctor";

    try {
      const emailToSend = String(email).trim().toLowerCase();

      const { data } = await api.post(`/api/${url}/login`, {
        email: emailToSend,
        password,
      });

      if (data.success) {
        // ✅ Store role
        localStorage.setItem("role", role);

        // ✅ Store token
        localStorage.setItem(tokenKey, data.token);

        // ✅ Update context
        setToken(data.token);

        toast.success("Login successful");

        setTimeout(() => {
          navigate(
            role === "admin" ? "/admin-dashboard" : "/doctor-dashboard",
            { replace: true },
          );
        }, 100);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-[#5F6FFF]">{state} </span>Login
        </p>

        {/* EMAIL */}
        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* PASSWORD WITH SHOW / HIDE */}
        <div className="w-full relative">
          <p>Password</p>

          <input
            className="border border-[#DADADA] rounded w-full p-2 mt-1 pr-10"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* SHOW / HIDE BUTTON */}
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] cursor-pointer text-sm text-gray-500 select-none"
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        {/* LOGIN BUTTON */}
        <button className="bg-[#5F6FFF] text-white w-full py-2 rounded-md text-base cursor-pointer">
          Login
        </button>

        {/* SWITCH ROLE */}
        {state === "Admin" ? (
          <p>
            Doctor Login?{" "}
            <span
              className="text-[#5F6FFF] underline cursor-pointer"
              onClick={() => setState("Doctor")}
            >
              Click here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?{" "}
            <span
              className="text-[#5F6FFF] underline cursor-pointer"
              onClick={() => setState("Admin")}
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
