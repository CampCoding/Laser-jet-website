import React, { useEffect, useState } from 'react'
import SideBar from '../SideBar/SideBar'
import Header from '../Header/Header'
import { conifgs } from '../../config'
import LoginPage from '../../pages/LoginPage/LoginPage'
import Cookies from "js-cookie";


export default function DefaultLayout({children}) {
   const [open , setOpen] = useState(false)
   const userToken = localStorage.getItem(conifgs.localStorageTokenName);
   const refreshToken = Cookies.get("laserget_refresh_token");
   if(!userToken || !refreshToken) {
      return <LoginPage />
   }
   
  return ( 
    <div className='flex'>

         <div className={`flex flex-col  w-full`}>
         {userToken && refreshToken  && <><Header setOpen={setOpen} open={open}/>
         <SideBar open={open} setOpen={setOpen}/></>} 
            <main className='m-5'>
               {children}
            </main>
         </div>
    </div>
  )
}
