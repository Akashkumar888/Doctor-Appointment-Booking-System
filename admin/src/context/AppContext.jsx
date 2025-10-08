
import { createContext } from "react";

// 1. Create the context
const AppContext=createContext();

// 2. Create Provider
export const AppContextProvider=({children})=>{
  // value is object 
 const value={
 
 };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContext;