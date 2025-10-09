
import { createContext, useState } from "react";

// create context
const AdminContext=createContext();

// create contextProvider

export const AdminContextProvider=({children})=>{

  const [aToken, setAToken] = useState(localStorage.getItem("aToken") || '');
  // const [aToken, setAToken] = useState(localStorage.getItem("aToken")?localStorage.getItem("aToken") : '');



  const value={
   aToken,
   setAToken,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}

export default AdminContext;