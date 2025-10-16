
import React, { useContext } from 'react'
import AdminContext from '../context/AdminContext'
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
import DoctorContext from '../context/DoctorContext';

const Sidebar = () => {
  const {aToken}=useContext(AdminContext);
  const {dToken}=useContext(DoctorContext);
  return (
    <div className='min-h-screen bg-white border-r'>
      {
        aToken && <ul className='text-[#515151] mt-5'>    {/*sidebar ke liye NavLink  use karo because it has isActive*/ }
          <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ?' bg-[#F2F3FF] border-r-4 border-[#5F6FFF]' : ''}`} to={'/admin-dashboard'}>
            <img src={assets.home_icon} alt="" />
            <p className='hidden md:block'>Dashboard</p>
          </NavLink>
          <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ?' bg-[#F2F3FF] border-r-4 border-[#5F6FFF]' : ''}`} to={'/all-appointments'}>
            <img src={assets.appointment_icon} alt="" />
            <p className='hidden md:block'>Appointments</p>
          </NavLink>
          <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ?' bg-[#F2F3FF] border-r-4 border-[#5F6FFF]' : ''}`} to={'/add-doctor'}>
            <img src={assets.add_icon} alt="" />
            <p className='hidden md:block'>Add Doctor</p>
          </NavLink>
          <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ?' bg-[#F2F3FF] border-r-4 border-[#5F6FFF]' : ''}`} to={'/doctor-list'}>
            <img src={assets.people_icon} alt="" />
            <p className='hidden md:block'>Doctors List</p>
          </NavLink>
        </ul>
      }
      
      
      {
        dToken && <ul className='text-[#515151] mt-5'>    {/*sidebar ke liye NavLink  use karo because it has isActive*/ }
          <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ?' bg-[#F2F3FF] border-r-4 border-[#5F6FFF]' : ''}`} to={'/doctor-dashboard'}>
            <img src={assets.home_icon} alt="" />
            <p className='hidden md:block'>Dashboard</p>
          </NavLink>
          <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ?' bg-[#F2F3FF] border-r-4 border-[#5F6FFF]' : ''}`} to={'/doctor-appointments'}>
            <img src={assets.appointment_icon} alt="" />
            <p className='hidden md:block'>Appointments</p>
          </NavLink>
          <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ?' bg-[#F2F3FF] border-r-4 border-[#5F6FFF]' : ''}`} to={'/doctor-profile'}>
            <img src={assets.people_icon} alt="" />
            <p className='hidden md:block'>Profile</p>
          </NavLink>
        </ul>
      }
    </div>
  )
}

export default Sidebar


// For industry-level React applications, especially when building a sidebar or navigation menu, you should prefer NavLink over Link in most cases. Here’s why:

// 1. Link
// Basic navigation between routes.
// Does not automatically add styling for active route.
// Example:
// <Link to="/dashboard">Dashboard</Link>

// 2. NavLink
// Extends Link with active styling out of the box.
// You can easily highlight the current page in the sidebar or menu.
// Accepts className or style as a function based on whether the route is active.
// Example:
// <NavLink 
//   to="/dashboard"
//   className={({ isActive }) => isActive ? "active-link" : "inactive-link"}
// >
//   Dashboard
// </NavLink>

// Industry-standard because users expect the sidebar/menu to highlight the active page, which improves UX.
// ✅ Recommendation
// Use NavLink for sidebar, header, or any navigation menu where highlighting active links matters.
// Use Link for simple in-content navigation, like “Back to homepage” buttons, breadcrumbs, etc.