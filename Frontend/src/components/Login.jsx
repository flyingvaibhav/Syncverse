import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios"; // ensure axios is imported
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

function Login() {
  const [, setAuthUser] = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        "http://localhost:5004/api/user/login",
        { email: data.email, password: data.password },
        { withCredentials: true }
      );
      setAuthUser(res.data.user);
      localStorage.setItem("ChatApp", JSON.stringify(res.data.user));
      toast.success("Logged in");
    } catch (e) {
      const msg = e.response?.data?.error || e.message || "Login failed";
      console.error("Login error:", e);
      toast.error(msg);
    }
  };

  // keep the card centered
  return (
    <div className="min-h-screen grid place-items-center">
      <form onSubmit={handleSubmit(onSubmit)} className="border border-black px-6 py-4 rounded-md space-y-3 w-96">
        <h1 className="text-2xl text-blue-600 font-bold">Messenger</h1>
        <h2 className="text-2xl">Login with your <span className="text-blue-600 font-semibold">Account</span></h2>

        <label className="input input-bordered flex items-center gap-2">
          <input type="email" className="grow" placeholder="Email" {...register("email", { required: true })} />
        </label>
        {errors.email && <span className="text-red-500 text-sm">Email is required</span>}

        <label className="input input-bordered flex items-center gap-2">
          <input type="password" className="grow" placeholder="Password" {...register("password", { required: true })} />
        </label>
        {errors.password && <span className="text-red-500 text-sm">Password is required</span>}

        <button type="submit" className="text-white bg-blue-600 cursor-pointer w-full rounded-lg py-2">Login</button>

        <p>Don't have any Account? <Link to="/signup" className="text-blue-500 underline">Signup</Link></p>
      </form>
    </div>
  );
}
export default Login;