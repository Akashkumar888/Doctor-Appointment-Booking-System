

import { useState } from "react";
import { createContext } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

// create context
const DoctorContext=createContext();

// create contextProvider

export const DoctorContextProvider=({children})=>{


  const [dToken,setDToken]=useState(()=> localStorage.getItem("dToken") || "");
  const [appointments,setAppointments]=useState([]);
  const [dashData,setDashData]=useState(false);
  const [profileData,setProfileData]=useState(false);

  const getAppointments=async()=>{
    try {
      const {data}=await api.get(`/api/doctor/appointments`);
      if(data.success){
        setAppointments(data.appointments);
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }
  
  const appointmentComplete = async (appointmentId) => {
  try {
    const { data } = await api.post(
      "/api/doctor/complete-appointment",
      { appointmentId }, // ✅ send JSON object, not raw value
    );

    if (data.success) {
      toast.success(data.message);
      getAppointments();
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.log(error);
    toast.error(error.response?.data?.message || error.message);
  }
};

const appointmentCancel = async (appointmentId) => {
  try {
    const { data } = await api.post(
      "/api/doctor/cancel-appointment",
      { appointmentId }, // ✅ same here
      );

    if (data.success) {
      toast.success(data.message);
      getAppointments();
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.log(error);
    toast.error(error.response?.data?.message || error.message);
  }
};


const doctorDashboard=async()=>{
  try {
    const {data}=await api.get(`/api/doctor/dashboard`);
    if(data.success){
     setDashData(data.dashData);
    }
    else{
      toast.error(data.message);
    }
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
};


const getDoctorProfile=async()=>{
  try {
    const {data}=await api.get(`/api/doctor/profile`);
    if(data.success){
      toast.success(data.message);
      setProfileData(data.profileData);
    }
    else{
      toast.error(data.message);
    }
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
}



  const value={
   dToken,
   setDToken,
   appointments,
   setAppointments,
   getAppointments,
   appointmentComplete,
   appointmentCancel,
   dashData,
   setDashData,
   doctorDashboard,
   profileData,
   setProfileData,
   getDoctorProfile
  };

  return (
    <DoctorContext.Provider value={value}>
      {children}
    </DoctorContext.Provider>
  )
}

export default DoctorContext;