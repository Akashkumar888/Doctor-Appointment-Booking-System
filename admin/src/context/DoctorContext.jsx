

import { useState } from "react";
import { createContext } from "react";

// create context
const DoctorContext=createContext();

// create contextProvider

export const DoctorContextProvider=({children})=>{


  const [dToken,setDToken]=useState(localStorage.getItem("dToken") || "");


  const value={
   dToken,
   setDToken,
  };

  return (
    <DoctorContext.Provider value={value}>
      {children}
    </DoctorContext.Provider>
  )
}

export default DoctorContext;