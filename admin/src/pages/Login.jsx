
import React, { useContext, useState } from 'react'
import {assets} from '../assets/assets'
import AdminContext from '../context/AdminContext';
import api from '../api/axios'
import { toast } from 'react-toastify';
import DoctorContext from '../context/DoctorContext';
import {useNavigate} from 'react-router-dom'

const Login = () => {
  const navigate=useNavigate();
  const [state,setState]=useState('Admin');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');

  const {aToken,setAToken}=useContext(AdminContext);
  const {dToken,setDToken}=useContext(DoctorContext);

  const onSubmitHandler=async(event)=>{
    event.preventDefault();
    let url = state === 'Admin' ? 'admin' : 'doctor';
    let token=state === 'Admin' ? 'aToken' : 'dToken';
    let setToken=state === 'Admin' ? setAToken : setDToken
    try {
        const {data}=await api.post(`/api/${url}/login`,{email,password});
        if(data.success){
          localStorage.setItem(`${token}`,data.token); // when we reload the webpage admin login using localStorage 
          setToken(data.token);   // ✅ update context state
          toast.success("Login successful");
          // ✅ Wait for context update before navigation
          setTimeout(() => {
            if (state === "Admin") {
              navigate("/admin-dashboard");
            } 
            else {
              navigate("/doctor-dashboard");
            }
          })
        }  
        else{
          toast.error(data.message);
        }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
      toast.error(error.response.data.message); // Shows "Invalid credentials"
    } else {
      toast.error("Something went wrong");
    }
    }
    
  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto'><span className='text-[#5F6FFF]'>{state} </span> Login</p>
        <div className='w-full'>
          <p>Email</p>
          <input className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required value={email} onChange={(e)=>setEmail(e.target.value)}/>
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input className='border border-[#DADADA] rounded w-full p-2 mt-1'  type="password" required value={password} onChange={(e)=>setPassword(e.target.value)}/>
        </div>
        <button className='bg-[#5F6FFF] text-white w-full py-2 rounded-md text-base cursor-pointer'>Login</button>
        {
          state==='Admin' ?
          <p>Doctor Login? <span className='text-[#5F6FFF] underline cursor-pointer' onClick={()=>setState("Doctor")}>Click here</span></p>
          : <p>Admin Login? <span className='text-[#5F6FFF] underline cursor-pointer' onClick={()=>setState("Admin")}>Click here</span></p>
        }
      </div>
    </form>
  )
}

export default Login