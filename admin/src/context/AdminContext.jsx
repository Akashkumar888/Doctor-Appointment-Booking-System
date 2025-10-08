
import { createContext } from "react";

// create context
const AdminContext=createContext();

// create contextProvider

export const AdminContextProvider=({children})=>{

  const value={

  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}

export default AdminContext;