
import React, { useContext, useEffect } from 'react'
import DoctorContext from '../../context/DoctorContext'

const DoctorDashBoard = () => {

  const {dToken, dashData, setDashData,doctorDashboard}=useContext(DoctorContext);
                
  
  useEffect(()=>{
  if(dToken){
    doctorDashboard();
  }
  },[dToken]);


  return dashData && (
    <div>
      
    </div>
  )
}

export default DoctorDashBoard
