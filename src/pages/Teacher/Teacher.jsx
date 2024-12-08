
import React, { useRef, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
import { getAccessToken, getRoles } from '../../services/ApiService';

import { ROLE_TEACHER } from '../../utils/Constant';
import Path from '../../utils/Path';
import SidebarTeacher from '../../components/form-controls/Nav/SidebarTeacher';
import { Header } from '../../components/form-controls/Nav/Header';

export default function Teacher() {
    const navigate = useNavigate();
   


    // const handleHover = (event) => {
    //     if (sidebarRef.current && event.type === 'mouseover') {
    //         console.log("hover");
    //         console.log(event.type);
    //         setIsHover(true);
    //     } else if (event.type === 'mouseout') {
    //         console.log(event.type);
    //         console.log("no hover");
    //         setIsHover(false);
    //     }
    // };
    // useEffect(() => {
    //     document.addEventListener('mouseover', handleHover);
    //     document.addEventListener('mouseout', handleHover);
    //     return () => {
    //         document.removeEventListener('mouseover', handleHover);
    //         document.removeEventListener('mouseout', handleHover);
    //     };
    // }, []);
    // useEffect(() => {
    //     //alert(location.pathname);
    //     let accessToken = getAccessToken();
    //     let roles = getRoles();
    //     if (!accessToken || !roles.includes(ROLE_TEACHER)) {
    //         navigate(Path.LOGIN);
    //     }
    // })
    return (
        // <div className='flex h-full w-full '>
        //     {/* <div className='fixed h-full top-0 left-0 w-[250px] '  >
        //         <SidebarTeacher  />
        //     </div> */}
        //     <Header/>
        //     <div className='h-full w-full mx-auto  pl-[100px]'>
        //         <Outlet />
        //     </div>
        // </div>
        <>
        <Header />
                  <hr className='pt-20' />
                  <Outlet /></>
    )
}

