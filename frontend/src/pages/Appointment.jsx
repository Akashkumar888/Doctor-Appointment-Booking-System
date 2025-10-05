
import React, { useContext, useEffect, useState } from 'react'
import { data, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';

const Appointment = () => {
  const [docInfo,setDocInfo]=useState(null);
  const [docSlots,setDocSlots]=useState([]);
  const [slotIndex,setSlotIndex]=useState(0);
  const [slotTime,setSlotTime]=useState('');
  const daysOfWeek=['SUN','MON',"TUE","WED","THU","FRI","SAT"];

  const {docId}=useParams();
  const {doctors,currencySymbol}=useContext(AppContext);

  const fetchDocInfo=async()=>{
    const docInfo=doctors.find(doc => doc._id === docId);
    setDocInfo(docInfo);
  }
  
  const getAvailableSlots = async () => {
  setDocSlots([]);

  let today = new Date();
  let startDayIndex = 0;

  // ⏰ If it's past 9 PM, skip today and start from tomorrow
  if (today.getHours() >= 21) {
    startDayIndex = 1;
  }

  for (let i = startDayIndex; i < startDayIndex + 7; i++) {
    let currentDate = new Date(today);
    currentDate.setDate(today.getDate() + i);

    // end time of that day
    let endTime = new Date();
    endTime.setDate(today.getDate() + i);
    endTime.setHours(21, 0, 0, 0);

    // set starting time
    if (i === 0) {
      // today → start from now (rounded) or 10 AM
      let now = new Date();
      let startHour = Math.max(now.getHours(), 10);
      currentDate.setHours(startHour);
      currentDate.setMinutes(now.getMinutes() > 30 ? 30 : 0);
    } else {
      // future days → always start from 10:00 AM
      currentDate.setHours(10);
      currentDate.setMinutes(0);
    }

    let timeSlots = [];
    while (currentDate < endTime) {
      let formattedTime = currentDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      timeSlots.push({
        datetime: new Date(currentDate),
        time: formattedTime,
      });

      currentDate.setMinutes(currentDate.getMinutes() + 30);
    }

    // always push (even if empty) so the day shows up
    setDocSlots((prev) => [...prev, timeSlots]);
  }
};


  useEffect(()=>{
  fetchDocInfo();
  },[docId,doctors]);

  useEffect(()=>{
  getAvailableSlots();
  },[docInfo]);
  
  useEffect(()=>{
  console.log(docSlots);
  },[docSlots])

  return docInfo && (
    <div>
      {/* doctor details  */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="">
          <img src={docInfo.image} alt="" className="bg-[#5f6FFF] w-full sm:max-w-72 rounded-lg" />
        </div>

        <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          {/* doc info:name degree experience  */}
          <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">{docInfo.name} 
            <img className='w-5' src={assets.verified_icon} alt="" />
            </p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p className="">{docInfo.degree} - {docInfo.speciality}</p>
            <button className="py-0.5 px-2 border text-xs rounded-full">{docInfo.experience}</button>
          </div>
          {/* doctors about  */}
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>About 
              <img className='' src={assets.info_icon} alt="" />
              </p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>
          <p className='text-gray-500 font-medium mt-4'>
            Appointment fee: <span className='text-gray-600'>{docInfo.fees}{currencySymbol}</span>
          </p>
        </div>
      </div>
      {/* booking slots  */}
      <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
      <p className="">Booking slots</p>
      <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
        {
          docSlots.length && docSlots.map((item,index)=>(
          <div onClick={()=>setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex===index?'bg-[#5f6FFF] text-white':'border border-gray-200'}`} key={index}>
            <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
            <p>{item[0] && item[0].datetime.getDate()}</p>
          </div>
          ))
        }
      </div>
      <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4 '>
        {
          docSlots.length && docSlots[slotIndex].map((item,index)=>(
            <p onClick={()=>setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time===slotTime ? 'bg-[#5f6FFF] text-white' :'text-gray-400 border border-gray-300' }`} key={index}>
              {item.time.toLowerCase()}
            </p>
          ))
        }
      </div>

    <button className='bg-[#5f6FFF] text-white text-sm font-light px-14 py-3
    rounded-full my-6 cursor-pointer'>Book an appointment</button>
      </div>

      {/* listing related doctors  */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality}/>

    </div>
  )
}

export default Appointment
