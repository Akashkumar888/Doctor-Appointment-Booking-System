

import { createContext } from "react";

// create context
const DoctorContext=createContext();

// create contextProvider

export const DoctorContextProvider=({children})=>{

  const value={

  };

  return (
    <DoctorContext.Provider value={value}>
      {children}
    </DoctorContext.Provider>
  )
}

export default DoctorContext;