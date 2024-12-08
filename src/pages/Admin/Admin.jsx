import React, { useEffect, useRef, useState } from 'react'
import { Sidebar } from '../../components/form-controls/Nav/Sidebar'
import { Outlet, useNavigate } from 'react-router-dom'
import { getAccessToken, getRoles } from '../../services/ApiService'
import Path from '../../utils/Path'
import { ROLE_ADMIN } from '../../utils/Constant'
import { useTranslation } from 'react-i18next'


 export const Admin = () => {
  const {t} = useTranslation();
  const [isClick, setClick] = useState(false);
  let navigate = useNavigate();
  const sidebarRef = useRef(null);

  const handleClick = () => {
    setClick(true);
  }

  const handleOutsideClick = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setClick(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    let accessToken = getAccessToken();
    let roles = getRoles();
    if (!accessToken || !roles.includes(ROLE_ADMIN)) {
      navigate(Path.LOGIN);
    }
  }, []);

  return (
    <div className='flex h-screen overflow-hidden w-screen'>
      <div>
        <button 
          onClick={() => { handleClick() }} 
          type="button" 
          className="inline-flex items-center p-2 mt-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        >
          <span className="sr-only">{t('Open sidebar')}</span>
          <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
          </svg>
        </button>
        {isClick && (
          <div className='fixed top-0 left-0 w-[250px] z-10 transition ease-in-out delay-1000 h-full' ref={sidebarRef}>
            <Sidebar handleOnClick={setClick} />
          </div>
        )}
      </div>

      <div className='flex-grow h-full overflow-y-auto ' onClick={() => { setClick(false) }}>
        <Outlet />
      </div>
    </div>
  )
}
