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

const App = () => {
  const {aToken}=useContext(AdminContext);

  return aToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer/>
      <Navbar/>
      <div className='flex items-start'>
        <Sidebar/> {/*sidebar ke andar sare routes bana jaha vaha routes bana do */}
        <Routes>
          <Route path='/' element={<></>}/>
          <Route path='/add-doctor' element={<AddDoctor/>}/>
          <Route path='/all-appointments' element={<AllAppointments/>}/>
          <Route path='/admin-dashboard' element={<Dashboard/>}/>
          <Route path='/doctor-list' element={<DoctorsList/>}/>
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
