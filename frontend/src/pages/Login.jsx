
import React, { useState } from 'react'
import api from '../api/axios';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const {token,setToken}=useContext(AppContext);
  const navigate=useNavigate();
  const [state, setState] = useState('Sign up');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  

  const onSubmitHandler=async(event)=>{
    event.preventDefault();

    const url = (state === 'Sign up') ? 'register' : 'login';

    const payload = (state === 'Sign up')
    ? { name, email, password }  // signup needs name
    : { email, password };       // login doesn’t need name

    try {
      const {data}=await api.post(`/api/user/${url}`,payload);
      if(data.success){
        localStorage.setItem("token",data.token);
        setToken(data.token); // ✅ use data.token, not the old token variable
        toast.success(data.message);
        navigate("/");  // 🔥 add this
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  useEffect(() => {
  if (token) navigate("/");
}, [token]);



  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center '>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>{state==='Sign up' ? "Create Account":"Login"}</p>
        <p>Please {state==='Sign up' ? "sign up":"log in"} to book appointment</p>
        {
        state==='Sign up' &&
        <div className="w-full">
          <p>Full Name</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" name='name' onChange={(e)=>setName(e.target.value)} value={name} required/>
        </div>
        }
        <div className="w-full">
          <p>Email</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="email" name='email' onChange={(e)=>setEmail(e.target.value)} value={email} required/>
        </div>
        <div className="w-full">
          <p>Password</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="password" name='password' onChange={(e)=>setPassword(e.target.value)} value={password} required/>
        </div>
          <button type='submit' className='bg-[#5f6FFF] text-white w-full py-2 rounded-md text-base cursor-pointer'>{state==='Sign up' ? "Create Account":"Login"}</button>
          {
            state==='Sign up'?<p>Already have an account? <span onClick={()=>setState("Login")} className='text-[#5f6FFF] underline cursor-pointer'>Login here</span></p>
            : <p>Create an new account? <span onClick={()=>setState("Sign up")} className='text-[#5f6FFF] underline cursor-pointer'>click here</span></p>
          }
      </div>
    </form>
  )
}

export default Login
