import React, { useState, useContext, useEffect } from "react";
import api from "../api/axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [state, setState] = useState("Sign up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // ✅ NEW: Password visibility state
  const [showPassword, setShowPassword] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const url = state === "Sign up" ? "register" : "login";

    const payload =
      state === "Sign up"
        ? { name, email, password }
        : { email, password };

    try {
      const { data } = await api.post(`/api/user/${url}`, payload);

      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);

        toast.success(data.message);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const errors = error.response?.data?.errors;
      const message = error.response?.data?.message;

      if (errors && errors.length > 0) {
        toast.error(errors[0]);
      } else if (message) {
        toast.error(message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="min-h-[80vh] flex items-center"
    >
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">

        <p className="text-2xl font-semibold">
          {state === "Sign up" ? "Create Account" : "Login"}
        </p>

        <p>
          Please {state === "Sign up" ? "sign up" : "log in"} to book appointment
        </p>

        {/* FULL NAME */}
        {state === "Sign up" && (
          <div className="w-full">
            <p>Full Name</p>
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        {/* EMAIL */}
        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* PASSWORD WITH SHOW / HIDE */}
        <div className="w-full relative">
          <p>Password</p>

          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1 pr-10"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* SHOW / HIDE BUTTON */}
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] cursor-pointer text-sm text-gray-500 select-none"
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="bg-[#5f6FFF] text-white w-full py-2 rounded-md text-base cursor-pointer"
        >
          {state === "Sign up" ? "Create Account" : "Login"}
        </button>

        {/* TOGGLE LOGIN / SIGNUP */}
        {state === "Sign up" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-[#5f6FFF] underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create a new account?{" "}
            <span
              onClick={() => setState("Sign up")}
              className="text-[#5f6FFF] underline cursor-pointer"
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
