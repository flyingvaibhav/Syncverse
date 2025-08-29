import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios"; // ensure axios is imported
import { useAuth } from "../context/AuthProvider";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

function Signup() {
  const [, setAuthUser] = useAuth();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch("password", "");
  const validatePasswordMatch = (v) => v === password || "Passwords do not match";

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        "http://localhost:5004/api/user/signup",
        {
          fullname: data.fullname,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
        },
        { withCredentials: true }
      );
      setAuthUser(res.data.user);
      localStorage.setItem("ChatApp", JSON.stringify(res.data.user));
      toast.success("Signup successful");
    } catch (e) {
      const msg = e.response?.data?.error || e.message || "Signup failed";
      console.error("Signup error:", e);
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center">
      <form onSubmit={handleSubmit(onSubmit)} className="border border-black px-6 py-4 rounded-md space-y-3 w-96">
        <h1 className="text-2xl text-blue-600 font-bold">Messenger</h1>
        <h2 className="text-2xl">Create a new <span className="text-blue-600 font-semibold">Account</span></h2>

        <label className="input input-bordered flex items-center gap-2">
          <input type="text" className="grow" placeholder="Fullname" {...register("fullname", { required: true })} />
        </label>
        {errors.fullname && <span className="text-red-500 text-sm">Fullname is required</span>}

        <label className="input input-bordered flex items-center gap-2">
          <input type="email" className="grow" placeholder="Email" {...register("email", { required: true })} />
        </label>
        {errors.email && <span className="text-red-500 text-sm">Email is required</span>}

        <label className="input input-bordered flex items-center gap-2">
          <input type="password" className="grow" placeholder="Password" {...register("password", { required: true, minLength: 6 })} />
        </label>
        {errors.password && <span className="text-red-500 text-sm">Min length 6</span>}

        <label className="input input-bordered flex items-center gap-2">
          <input type="password" className="grow" placeholder="Confirm password" {...register("confirmPassword", { required: true, validate: validatePasswordMatch })} />
        </label>
        {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>}

        <button type="submit" className="text-white bg-blue-600 cursor-pointer w-full rounded-lg py-2">Signup</button>
        <p>Have any Account? <Link to="/login" className="text-blue-500 underline">Login</Link></p>
      </form>
    </div>
  );
}
export default Signup;