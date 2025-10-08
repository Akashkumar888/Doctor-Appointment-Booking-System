
import React, { useState } from 'react'
import {assets} from '../assets/assets'

const Login = () => {
  const [state,setState]=useState(false);


  return (
    <div>
      <img src={assets.log} alt="" />
    </div>
  )
}

export default Login