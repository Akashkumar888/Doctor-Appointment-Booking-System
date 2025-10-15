import React, { useContext } from 'react'
import {Routes,Route} from 'react-router-dom'
import Login from './pages/Login'
import {ToastContainer} from 'react-toastify';
import AdminContext from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AddDoctor from './pages/Admin/AddDoctor';
import AllAppointments from './pages/Admin/AllAppointments';
import Dashboard from './pages/Admin/Dashboard';
import DoctorsList from './pages/Admin/DoctorsList';
import DoctorContext from './context/DoctorContext';
import DoctorDashBoard from './pages/Doctor/DoctorDashBoard';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorProfile from './pages/Doctor/DoctorProfile';

const App = () => {
  const {aToken}=useContext(AdminContext);
  const {dToken}=useContext(DoctorContext);

  return aToken || dToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer/>
      <Navbar/>
      <div className='flex items-start'>
        <Sidebar/> {/*sidebar ke andar sare routes bana jaha vaha routes bana do */}
        <Routes>

          {/* Admin routes  */}
          <Route path='/' element={<></>}/>
          <Route path='/add-doctor' element={<AddDoctor/>}/>
          <Route path='/all-appointments' element={<AllAppointments/>}/>
          <Route path='/admin-dashboard' element={<Dashboard/>}/>
          <Route path='/doctor-list' element={<DoctorsList/>}/>


          {/* doctor routes  */}
          <Route path='/doctor-dashboard' element={<DoctorDashBoard/>}/>
          <Route path='/doctor-appointments' element={<DoctorAppointments/>}/>
          <Route path='/doctor-profile' element={<DoctorProfile/>}/>

        </Routes>
      </div>
    </div>
  ) :
  ( 
    <>
    <ToastContainer/>
      <Login/>
    </>
  )
}

export default App
