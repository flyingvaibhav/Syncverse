import React from 'react'
import { useForm } from "react-hook-form"
import axios from 'axios';

export default function Signup() {


 

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()
  const password = watch('password', '')
  const confirmPassword = watch('confirmPassword', '')
  const validatePasswordMatch=(value) => { return value === password || "Passwords do not match" 

  };
  const onSubmit = (data) => {
    const userInfo = {
      name: data.username,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,

    }
axios.post('http://localhost:5002/user/signup', userInfo) 
.then((response)=>  {
  console.log(response.data);
if(response.data){
  alert("Signup successful! You can now log in.");
}

localStorage.setItem("userInfo", JSON.stringify(userInfo)); 

}).catch((error) => {
  console.error(error);
});
  }
  return (
  <>
  <div>

    <div className="flex h-screen items-center justify-center">


<form onSubmit={handleSubmit(onSubmit)} className='border border-black px-6 py-3 rounded-md space-y-3 w-96'>
<h1 className='text-2xl items-center'> Create a new{" "} <span className='font-bold text-blue-600' >Account</span>
</h1>
<h2>Its free and always will be</h2>
<br></br>

{ /* Email Field */}

<label className="input input-bordered flex items-center gap-2">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className="h-4 w-4 opacity-70">
    <path
      d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
    <path
      d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
  </svg>
  <input type="text" className="grow" placeholder="Email" {...register(
    'email',{ required: true }
  )} />

</label>
  {
  errors.email && <span className='text-red-600'> This field is required</span>
}

{/* Username Field */}

<label className="input input-bordered flex items-center gap-2">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className="h-4 w-4 opacity-70">
    <path
      d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
  </svg>
  <input type="text" className="grow" placeholder="Username" {...register(
    'username',{ required: true }
  )} />
  
</label>

{
  errors.username && <span className='text-red-600'> This field is required</span>
}

{/* Password Field */}

<label className="input input-bordered flex items-center gap-2">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className="h-4 w-4 opacity-70">
    <path
      fillRule="evenodd"
      d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
      clipRule="evenodd" />
  </svg>
  <input type="password" className="grow" placeholder="Password" {...register(
    'password',{ required: true }
  )} />
  
</label>


{
  errors.password && <span className='text-red-600'> This field is required</span>
}

{/* Confirm Password Field */}

<label className="input input-bordered flex items-center gap-2">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className="h-4 w-4 opacity-70">
    <path
      fillRule="evenodd"
      d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
      clipRule="evenodd" />
  </svg>
  <input type="password" className="grow" placeholder="Confirm password" {...register(
    'confirmPassword',{ required: true,  validate: validatePasswordMatch }
  )} />


</label>
  {
  errors.confirmPassword && <span className='text-red-600'> {errors.confirmPassword.message}</span>
}

<div className='flex justify-center'>
<input type="submit" 
value="Sign up" 
className='text-white bg-blue-600  cursor-pointer w-full py-2 rounded-lg'></input>


</div>
</form>

    </div>
    
<p>
  Already have an account?<span className='text-blue-600 underline cursor-pointer'>{" "} Login</span>

</p>
  </div>
  </>
  )
}

