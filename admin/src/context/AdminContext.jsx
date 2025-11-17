
import { createContext, useState } from "react";
import api from "../api/axios";
import {toast} from 'react-toastify'

// create context
const AdminContext=createContext();

// create contextProvider

export const AdminContextProvider=({children})=>{

  const [aToken, setAToken] = useState(localStorage.getItem("aToken") || '');
  // const [aToken, setAToken] = useState(localStorage.getItem("aToken")?localStorage.getItem("aToken") : '');
  const [doctors,setDoctors]=useState([]);
  const [appointments,setAppointments]=useState([]);
  const [dashData,setDashData]=useState(false);

  const getAllDoctors=async()=>{
       try {
        const {data}=await api.post(`/api/admin/all-doctors`,{});
        if(data.success){
          setDoctors(data.doctors);
          console.log(data.doctors);
        }
        else{
          toast.error(data.message);
        }
       } catch (error) {
        toast.error(error.message);
       }
  }

  const changeAvailability=async(docId)=>{
    try {
      const {data}=await api.post(`/api/admin/change-availability`,{docId});
    if(data.success){
     toast.success(data.message);
     getAllDoctors(); 
    }
    else{
      toast.error(data.message);
    }
    } catch (error) {
      toast.error(error.message);
    }
  }


  const getAllAppointments=async()=>{
    try {
      const {data}=await api.get(`/api/admin/appointments`);
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

  const cancelAppointment=async(appointmentId)=>{
    try {
      const {data}=await api.post(`/api/admin/cancel-appointment`,{appointmentId});
      if(data.success){
        toast.success(data.message);
        getAllAppointments();
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }


  const adminDashData=async()=>{
    try {
      const {data}=await api.get(`/api/admin/dashboard`);
      if(data.success){
        setDashData(data.dashData);
        getAllAppointments();
      }
      else{
        toast.error(data.success);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }


  const value={
   aToken,
   setAToken,
   doctors,
   getAllDoctors,
   changeAvailability,
   appointments,
   setAppointments,
   getAllAppointments,
   cancelAppointment,
   dashData,
   setDashData,
   adminDashData,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}

export default AdminContext;