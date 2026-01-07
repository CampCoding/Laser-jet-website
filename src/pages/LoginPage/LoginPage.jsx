import React, { useEffect, useState } from 'react'
import { BiLoaderCircle } from 'react-icons/bi'
import { useDispatch, useSelector } from 'react-redux';
import { fetchLogin } from '../../features/loginSlice';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { conifgs } from '../../config';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';


export default function LoginPage() {
  const [loginData , setLoginData] = useState({
    email:"",
    password:""
  })
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {data , loading , error} = useSelector(state => state?.login);

  async function handleSubmit(e) {
    e.preventDefault();

    if(!loading) {
     await dispatch(fetchLogin(loginData)).then(res => {
      console.log(res)
      if(res?.payload?.success) {
        toast.success(res?.payload.message)
        Cookies.set("laserget_refresh_token" , res?.payload?.data?.refreshToken )
        localStorage.setItem(conifgs.localStorageTokenName , res?.payload?.data?.accessToken)
        navigate("/");
        window.location.reload();
      }else {
        toast.error(res?.payload)
      }
     })
    }
  }

  return (
    <div>
       <div  className="flex flex-col justify-center items-center gap-3 h-screen min-w-[200px]">
              <div className="w-[400px]">
              <div class="text-center mb-8 mx-auto">     
                <img className='w-[200px] mx-auto h-[100px] object-cover' src="https://laserjet-8405a.web.app/media/logos/logo.png"/>
            </div>
              
             <form onSubmit={handleSubmit} className="flex flex-col gap-3">
               <div className="input-group">
                <label>Email</label>
                <input type='email' value={loginData?.email} onChange={(e) => setLoginData({...loginData,email:e.target.value})}/>
               </div>

               <div className="input-group">
                <label>Password</label>
                <input type='password' value={loginData?.password} onChange={(e) => setLoginData({...loginData,password:e.target.value})}/>
               </div>

               <button className='mt-5 w-full flex justify-center p-3 rounded-md items-center text-white bg-[#0d6efd]'>{loading ?"Loading..." :"Login"}</button>
             </form>
              </div>
           
        </div>
    </div>
  )
}
