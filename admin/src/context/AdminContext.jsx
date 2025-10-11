
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

  const getAllDoctors=async()=>{
       try {
        const {data}=await api.post(`/api/admin/all-doctors`,{},{
          headers:{
            Authorization:`Bearer ${aToken}`
          }
        });
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
      const {data}=await api.post(`/api/admin/change-availability`,{docId},{
      headers:{
        Authorization:`Bearer ${aToken}`
      }
    });
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

  const value={
   aToken,
   setAToken,
   doctors,
   getAllDoctors,
   changeAvailability
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}

export default AdminContext;