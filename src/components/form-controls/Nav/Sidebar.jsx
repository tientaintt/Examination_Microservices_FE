import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Path from '../../../utils/Path'
import { removeCredential } from '../../../services/ApiService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faBook, faChalkboardTeacher, faHome, faSchool, faSignOutAlt, faUserGraduate } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { Button, Menu, MenuHandler, MenuItem, MenuList } from '@material-tailwind/react'
import { useLanguage } from '../../../App';
import vietNamIcon from '../../../assets/vietnam-icon.png';
import ukIcon from '../../../assets/uk-icon.png';
import ButtonNotify from '../Button/ButtonNotify';
export const Sidebar = (props) => {
   let navigate = useNavigate();
   const { handleOnClick } = props;
   const { language, setLanguage } = useLanguage();
   const { t, i18n } = useTranslation();
   
 
   const handlerClickTranslation = (lang) => {
      console.log("Language changed to:", lang);
      setLanguage(lang)

   }

   const changeLanguage = (lng) => {
      console.log(lng)
      i18n.changeLanguage(lng);
   };

 
   const handleLogOut = () => {

      // handleOnClick(false);
      navigate(Path.LOGIN);
      removeCredential();

   }
   useEffect(() => {
      changeLanguage(language);
   }, [language])
   return (
      <div className=' h-auto w-[250px] transition-all ease-in-out duration-700 delay-1000'>
         <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
            <span className="sr-only">{t('Open sidebar')}</span>
            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
               <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
            </svg>
         </button>
         <aside id="logo-sidebar" className=" top-0 left-0 z-40 w-[280px] h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
            <div className="h-full w-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
               <div className='flex flex-row items-center justify-between mb-3 '>
               <p className="flex items-center  justify-center">
                  <svg className="h-6 mr-3 sm:h-7" fill="#000000" width="40px" height="40px" viewBox="0 0 30 30" version="1.1" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" ><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>administrator-solid</title> <circle cx="14.67" cy="8.3" r="6" className="clr-i-solid clr-i-solid-path-1"></circle><path d="M16.44,31.82a2.15,2.15,0,0,1-.38-2.55l.53-1-1.09-.33A2.14,2.14,0,0,1,14,25.84V23.79a2.16,2.16,0,0,1,1.53-2.07l1.09-.33-.52-1a2.17,2.17,0,0,1,.35-2.52,18.92,18.92,0,0,0-2.32-.16A15.58,15.58,0,0,0,2,23.07v7.75a1,1,0,0,0,1,1H16.44Z" className="clr-i-solid clr-i-solid-path-2"></path><path d="M33.7,23.46l-2-.6a6.73,6.73,0,0,0-.58-1.42l1-1.86a.35.35,0,0,0-.07-.43l-1.45-1.46a.38.38,0,0,0-.43-.07l-1.85,1a7.74,7.74,0,0,0-1.43-.6l-.61-2a.38.38,0,0,0-.36-.25H23.84a.38.38,0,0,0-.35.26l-.6,2a6.85,6.85,0,0,0-1.45.61l-1.81-1a.38.38,0,0,0-.44.06l-1.47,1.44a.37.37,0,0,0-.07.44l1,1.82A7.24,7.24,0,0,0,18,22.83l-2,.61a.36.36,0,0,0-.26.35v2.05a.36.36,0,0,0,.26.35l2,.61a7.29,7.29,0,0,0,.6,1.41l-1,1.9a.37.37,0,0,0,.07.44L19.16,32a.38.38,0,0,0,.44.06l1.87-1a7.09,7.09,0,0,0,1.4.57l.6,2.05a.38.38,0,0,0,.36.26h2.05a.38.38,0,0,0,.35-.26l.6-2.05a6.68,6.68,0,0,0,1.38-.57l1.89,1a.38.38,0,0,0,.44-.06L32,30.55a.38.38,0,0,0,.06-.44l-1-1.88a6.92,6.92,0,0,0,.57-1.38l2-.61a.39.39,0,0,0,.27-.35V23.82A.4.4,0,0,0,33.7,23.46Zm-8.83,4.72a3.34,3.34,0,1,1,3.33-3.34A3.34,3.34,0,0,1,24.87,28.18Z" className="clr-i-solid clr-i-solid-path-3"></path> <rect x="0" y="0" width="36" height="36" fillOpacity="0"></rect> </g></svg>

                  <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">{t('Admin')}</span>
               </p>
              
               </div>


               <ul className="space-y-2 font-medium w-[250px]">

                  <li className=''>
                     <NavLink to={'/admin/'} className={({ isActive }) => (isActive ? 'flex items-center p-2 rounded-lg dark:text-white bg-gradient-to-r from-orange-300 to-red-300 text-[#fff]' : 'flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group')} onClick={() => handleOnClick(false)}>
                        <FontAwesomeIcon icon={faHome} style={{ height: 20, color: 'GrayText' }} />
                        <span className="flex-1 ml-3 whitespace-nowrap">{t('Dashboard')}</span>
                     </NavLink>
                  </li>
                  <li className=''>
                     <NavLink className={({ isActive }) => (isActive ? 'flex items-center p-2 rounded-lg dark:text-white bg-gradient-to-r from-orange-300 to-red-300 text-[#fff]' : 'flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group')} to={Path.AMCLASSMANAGER} onClick={() => handleOnClick(false)} >
                        <FontAwesomeIcon icon={faSchool} style={{ height: 20, color: 'GrayText' }} />
                        <span className="ml-3">{t('Subject management')}</span>
                     </NavLink>
                  </li>
                  <li className=''>
                     <NavLink to={'/admin/student'} className={({ isActive }) => (isActive ? 'flex items-center p-2 rounded-lg dark:text-white bg-gradient-to-r from-orange-300 to-red-300 text-[#fff]' : 'flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group')} onClick={() => handleOnClick(false)}>
                        <FontAwesomeIcon icon={faUserGraduate} style={{ height: 20, color: 'GrayText' }} />
                        <span className="flex-1 ml-3 whitespace-nowrap">{t('Student management')}</span>
                     </NavLink>
                  </li>
                  <li className=''>
                     <NavLink to={Path.AMTEACHERMANAGER} className={({ isActive }) => (isActive ? 'flex items-center p-2 rounded-lg dark:text-white bg-gradient-to-r from-orange-300 to-red-300 text-[#fff]' : 'flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group')} onClick={() => handleOnClick(false)}>
                        <FontAwesomeIcon icon={faChalkboardTeacher} style={{ height: 20, color: 'GrayText' }} />
                        <span className="flex-1 ml-3 whitespace-nowrap">{t('Teacher management')}</span>
                     </NavLink>
                  </li>
                  <NavLink to={'/login'} className={({ isActive }) => (isActive ? 'flex items-center p-2 rounded-lg dark:text-white bg-gradient-to-r from-orange-300 to-red-300 text-[#fff]' : 'flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group')} onClick={() => handleLogOut()} >
                     <li className='flex items-center rounded-lg' >
                        <FontAwesomeIcon icon={faSignOutAlt} style={{ height: 20, color: 'GrayText' }} />
                        <span className="flex-1 ml-3 whitespace-nowrap">{t('Log out')}</span>
                     </li>
                  </NavLink>
                  <li className='flex items-center justify-center h-16'>
                     <Menu >
                        <MenuHandler >
                           <Button className='flex flex-row border-slate-700 border rounded-full  bg-gray-50  items-center justify-center w-full'>
                              <img className="w-5 h-5 rounded-full" src={language == 'vi' ? vietNamIcon : ukIcon} alt='vi' />
                              {/* <FontAwesomeIcon icon={faAngleDown} className='ml-1' style={{ color: "#00f004", }} /> */}
                           </Button>

                        </MenuHandler>

                        <MenuList className='rounded-md z-50 bg-gray-200 '>
                           <MenuItem className='rounded-sm hover:bg-slate-200 flex justify-start py-2 w-full' onMouseDown={() => handlerClickTranslation('vi')}>
                              <img className="w-5 h-5 rounded-full" src={vietNamIcon} alt='vi' />
                           </MenuItem>
                           <MenuItem className='rounded-sm hover:bg-slate-200 flex justify-start py-2 ' onMouseDown={() => handlerClickTranslation('en')} >
                              <img className="w-5 h-5 rounded-full" src={ukIcon} alt='en' />
                           </MenuItem>
                        </MenuList>

                     </Menu>
                  </li>
               </ul>

            </div>
         </aside>
      </div>
   )
}
