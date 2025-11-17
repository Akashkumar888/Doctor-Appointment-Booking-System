
import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import api from '../../api/axios';
import AdminContext from '../../context/AdminContext'
import {toast} from 'react-toastify'

const AddDoctor = () => {

  const [docImg,setDocImg]=useState(false);
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [experience,setExperience]=useState('1 Year');
  const [fees,setFees]=useState('');
  const [about,setAbout]=useState('');
  const [speciality,setSpeciality]=useState('General physician');
  const [degree,setDegree]=useState('');
  const [address1,setAddress1]=useState('');
  const [address2,setAddress2]=useState('');

  const {aToken}=useContext(AdminContext);

  

  const onSubmitHandler=async(event)=>{   
    event.preventDefault();

    try {
      if(!docImg){
        return toast.error("Image not select");
      }
      const formData=new FormData(); // create formdata contructor 
      formData.append('image',docImg);// same field name image which was i use in multer
      // multer setup (server)
     // upload.single('image') // 'image' must match formData.append('image', ...)
 
      formData.append('name',name);
      formData.append('email',email);
      formData.append('password',password);
      formData.append('experience',experience);
      formData.append('fees',Number(fees));// optional, server will receive as string otherwise
      formData.append('about',about);
      formData.append('speciality',speciality);
      formData.append('degree',degree);
      // for nested object (address) you have two main options:
      formData.append('address',JSON.stringify({
        line1:address1,
        line2:address2
      }));
      
      // console log formData
      formData.forEach((value,key)=>{
        console.log(`${key} : ${value}`)
      });

      const {data}=await api.post(`/api/admin/add-doctor`,formData);
      if(data.success){
        toast.success(data.message);
        
        // 🧼 Reset all form fields here
        setDocImg(false);
        setName('');
        setEmail('');
        setPassword('');
        setFees('');
        setAbout('');
        setDegree('');
        setAddress1('');
        setAddress2('');
      }
      else{
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='m-5 w-full'>
      <p className='mb-3 text-lg font-medium'>Add Doctor</p>

      <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>

        <div className='flex items-center gap-4 mb-8 text-gray-500'>
          <label htmlFor="doc-img">
            <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="" />
          </label>
          <input type="file" id='doc-img' hidden onChange={(e)=>setDocImg(e.target.files[0])}/>
          <p>Upload doctor <br /> picture </p>
        </div>

       <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
        <div className='w-full lg:flex-1 flex flex-col gap-4'>

          <div className='flex-1 flex-col gap-1'>
          <p>Doctor name</p>
          <input className='border rounded px-3 py-2' type="text" placeholder='Name' required value={name} onChange={(e)=>setName(e.target.value)}/>
        </div>
    
        <div className='flex-1 flex-col gap-1'>
          <p>Doctor email</p>
          <input className='border rounded px-3 py-2' type="email" placeholder='Email' required value={email} onChange={(e)=>setEmail(e.target.value)}/>
        </div>

       <div className='flex-1 flex-col gap-1'>
          <p>Doctor password</p>
          <input className='border rounded px-3 py-2' type="password" placeholder='Password' required value={password} onChange={(e)=>setPassword(e.target.value)}/>
        </div>


        <div className='flex-1 flex-col gap-1'>
          <p>Experience</p>
          <select className='border rounded px-3 py-2' value={experience} onChange={(e)=>setExperience(e.target.value)} >
            <option value="1 Year">1 Year</option>
            <option value="2 Years">2 Years</option>
            <option value="3 Years">3 Years</option>
            <option value="4 Years">4 Years</option>
            <option value="5 Years">5 Years</option>
            <option value="6 Years">6 Years</option>
            <option value="7 Years">7 Years</option>
            <option value="8 Years">8 Years</option>
            <option value="9 Years">9 Years</option>
            <option value="10 Years">10 Years</option>
          </select>
        </div>
        
        <div className='flex-1 flex-col gap-1'>
          <p>Fees</p>
          <input className='border rounded px-3 py-2' type="number" placeholder='fees' required value={fees} onChange={(e)=>setFees(e.target.value)}/>
        </div>
        </div>


        <div className='w-full lg:flex-1 flex flex-col gap-4'>
        <div className='flex-1 flex-col gap-1'>
          <p>Speciality</p>
          <select className='border rounded px-3 py-2' value={speciality} onChange={(e)=>setSpeciality(e.target.value)}>
            <option value="General physician">General physician</option>
            <option value="Gynecologist">Gynecologist</option>
            <option value="Dermatologist">Dermatologist</option>
            <option value="Pediatricians">Pediatricians</option>
            <option value="Neurologist">Neurologist</option>
            <option value="Gastroenterologist">Gastroenterologist</option>
          </select>
        </div>

        <div className='flex-1 flex-col gap-1'>
          <p>Education</p>
          <input className='border rounded px-3 py-2' type="text" placeholder='Education' required value={degree} onChange={(e)=>setDegree(e.target.value)}/>
        </div>

        <div className='flex-1 flex-col gap-1'>
          <p>Address</p>
          <input className='border rounded px-3 py-2' type="text" placeholder='address 1' required value={address1} onChange={(e)=>setAddress1(e.target.value)}/>
          <input className='border rounded px-3 py-2' type="text" placeholder='address 2' required value={address2} onChange={(e)=>setAddress2(e.target.value)}/>
        </div>
        </div>
       </div>

       <div>
        <p className='mt-4 mb-2'>About Doctor</p>
        <textarea className='w-full px-4 pt-2 border rounded'  placeholder='write about doctor' rows={5} value={about} onChange={(e)=>setAbout(e.target.value)}/>
       </div>

       <button type='submit' className='bg-[#5f6FFF] px-10 py-3 mt-4 text-white rounded-full cursor-pointer'>Add doctor</button>
      </div>
    </form>
  )
}

export default AddDoctor