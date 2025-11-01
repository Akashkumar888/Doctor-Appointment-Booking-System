
import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import AdminContext from '../context/AdminContext'
import { useNavigate } from 'react-router-dom';
import DoctorContext from '../context/DoctorContext';
import api from '../api/axios';
import {toast} from 'react-toastify'

const Navbar = () => {
  const {aToken,setAToken}=useContext(AdminContext);
  const {dToken,setDToken}=useContext(DoctorContext);
  const navigate=useNavigate();

  const logoutHandler = () => {
  
  if (aToken) {
    localStorage.removeItem("aToken");
    setAToken("");
  }

  if (dToken) {
    localStorage.removeItem("dToken");
    setDToken("");
  }

  toast.success("Logged out successfully");
  navigate("/");
};




  
  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
      <div className='flex items-center gap-2 text-xs'>
        <img className='w-36 sm:w-40 cursor-pointer' src={assets.admin_logo} alt="" />
        <p className='border p-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>
          {aToken?'Admin':'Doctor'}
        </p>
      </div>
      <button onClick={logoutHandler} className='bg-[#5F6FFF] text-white text-sm cursor-pointer px-10 py-2 rounded-full'>Logout</button>
    </div>
  )
}

export default Navbar


// 1. localStorage.setItem(key, value)
// Stores a value (as string) under a key.
// localStorage.setItem("token", "abc123");

// 2. localStorage.getItem(key)
// Retrieves the value stored for a key. Returns null if not found.
// const token = localStorage.getItem("token"); // "abc123"

// 3. localStorage.removeItem(key)
// Deletes the item associated with the key.
// localStorage.removeItem("token");

// 4. localStorage.clear()
// Clears all items in localStorage.
// localStorage.clear();

// 5. localStorage.key(index)
// Returns the key at the specified index.
// localStorage.setItem("token", "abc123");
// localStorage.setItem("user", "Akash");
// console.log(localStorage.key(0)); // "token"

// 6. localStorage.length
// Returns the number of items stored.
// console.log(localStorage.length); // 2
// Tips for development:
// LocalStorage only stores strings, so use JSON.stringify() / JSON.parse() for objects or arrays.
// localStorage.setItem("user", JSON.stringify({name:"Akash"}));
// const user = JSON.parse(localStorage.getItem("user"));
