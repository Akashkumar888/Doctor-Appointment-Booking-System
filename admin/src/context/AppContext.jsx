
import { createContext } from "react";

// 1. Create the context
const AppContext=createContext();

// 2. Create Provider
export const AppContextProvider=({children})=>{
  // value is object 

  const calculateAge=(dob)=>{
    const today=new Date();
    // This creates a Date object representing the current date and time (today’s date).
    const birthDate=new Date(dob);
// Converts the given date of birth string (e.g. "2003-07-13") into a JavaScript Date object.
    let age=today.getFullYear() - birthDate.getFullYear();
    return age;
  }

  const currencySymbol="$";

  const months=["", "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const slotDateFormat=(slotDate)=>{
   const dateArray=slotDate.split("-");
   return dateArray[0]+" " + months[Number(dateArray[1])] + " " + dateArray[2];
  }

 const value={
 calculateAge,
 slotDateFormat,
 currencySymbol,
 };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContext;