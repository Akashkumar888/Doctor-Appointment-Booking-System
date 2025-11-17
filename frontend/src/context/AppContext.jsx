import { createContext, useEffect, useState } from "react";
import api from "../api/axios";
import {toast} from 'react-toastify'

export const AppContext=createContext();

const AppContextProvider=({children})=>{ // direct destructuring using {}

  const currencySymbol="$";
  const [doctors, setDoctors] = useState([]);
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");

  const getDoctorsData=async()=>{
    try {
      const {data}=await api.get(`/api/doctor/list`);
      if(data.success){
        setDoctors(data.doctors);
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const loadUserProfileData=async()=>{
    try {
      const {data}=await api.get(`/api/user/get-profile`);
      if(data.success){
      setUserData(data.user);
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  useEffect(()=>{
   getDoctorsData();
  },[]);


 useEffect(()=>{
 if(token){
  loadUserProfileData();
 }
 else{
  setUserData(null);
 }
 },[token]);


  const value={
    doctors,
    getDoctorsData,
    currencySymbol,
    setDoctors,
    token,
    setToken,
    userData,
    setUserData,
    loadUserProfileData
  };
  
  

  return (
    <AppContext.Provider value={value}>
      
      {children} 
      
    </AppContext.Provider>
  )
};



export default AppContextProvider;