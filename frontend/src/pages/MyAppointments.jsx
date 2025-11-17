
import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import api from '../api/axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useState } from 'react';
import {useNavigate} from 'react-router-dom'

const MyAppointments = () => {
  const navigate=useNavigate();
  const {token,getDoctorsData,currencySymbol}=useContext(AppContext);

  const [appointments,setAppointments]=useState([]);
  const months=["", "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const slotDateFormat=(slotDate)=>{
   const dateArray=slotDate.split("-");
   return dateArray[0]+" " + months[Number(dateArray[1])] + " " + dateArray[2];
  }

  const getUserAppointment=async()=>{
    try {
      const {data}=await api.get(`/api/user/appointments`);
      if(data.success){
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

const cancelAppointment=async(appointmentId)=>{
  try {
    const {data}=await api.post(`/api/user/cancel-appointment`,{appointmentId});
    if(data.success){
      toast.success(data.message);
      getUserAppointment();
      getDoctorsData();
    }
    else{
      toast.error(data.error);
    }
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
}

const appointmentRazorpay=async(appointmentId)=>{
  try {
    const {data}=await api.post(`/api/user/create-order`,{appointmentId,currencySymbol});
    if(data.success){
      initializeOrder(data.order);
    }
    else{
      toast.error(data.message);
    }
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
}


const initializeOrder=(order)=>{
   const options={
    key:import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount:order.amount,
    currency:order.currency,
    name:'Appointment Payment',
    description:'Appointment Payment',
    order_id:order.id,
    receipt:order.receipt,
    handler:async(response)=>{
      try {
        const {data}=await api.post(`/api/user/verify-order`,response);
        if(data.success){
        getUserAppointment();
        navigate("/my-appointments");
        }
        else{
          toast.error(data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
   }

   const rzp=new window.Razorpay(options);
   rzp.open();// for razorpay pop-up 
}


 
useEffect(()=>{
  if(token){
    getUserAppointment();
  }
},[token]);

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>
      <div>
      {
        appointments.map((item,index)=>(
          <div className='grid grid-cols-[1fr_3fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
            <div>
              <img className='w-32 bg-indigo-50' src={item.docData.image} alt="" />
            </div>
            <div className='flex-1 text-sm text-zinc-600'>
              <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
              <p>{item.docData.speciality}</p>
              <p className='text-zinc-700 font-medium mt-1'>Address</p>
              <p className='text-xs'>{item.docData.address.line1}</p>
              <p className='text-xs'>{item.docData.address.line2}</p>
              <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time: </span>{slotDateFormat(item.slotDate)} | {item.slotTime}</p>
            </div>
            <div></div>
            <div className='flex flex-col gap-2 justify-end'>
              {!item.cancelled && item.payment && !item.isCompleted && <button className='sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50'>Paid</button>}
             {!item.cancelled  && !item.payment && !item.isCompleted && <button onClick={()=>appointmentRazorpay(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-[#5f6FFF] hover:text-white transition-all duration-300 cursor-pointer'>Pay Online</button> } 
              {!item.cancelled && !item.isCompleted && <button onClick={()=>cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded  hover:bg-red-600 hover:text-white transition-all duration-300 cursor-pointer'>Cancel appointment</button> }
              {item.cancelled && !item.isCompleted && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>
                Appointment cancelled</button>}
                {
                  item.isCompleted && <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>
                    Completed
                  </button>
                }
            </div>
          </div>
        ))
      }
      </div>
    </div>
  )
}

export default MyAppointments
