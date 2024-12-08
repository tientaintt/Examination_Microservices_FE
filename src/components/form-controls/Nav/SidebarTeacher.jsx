import React, { useState } from 'react'
import IconTeacher from '../../../assets/icons8-teacher-96.png'
export default function SidebarTeacher(props) {
    const [isHover, setHover] = useState(false);
    return (
        <div className={isHover ? 'h-full w-[250px] bg-slate-400 transition-all duration-500' : 'h-full w-[100px] bg-slate-400 transition-all duration-500'} onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}>
            {
                isHover && <>

                    <div className=' mx-2  flex items-center flex-row  bg-yellow-600'>

                        <img className="h-20 w-20" src={IconTeacher} alt=""></img>
                        <h1 className='text-[32px] '>
                            Teacher
                        </h1>
                    </div>
                    <div className='m-2'>
                        <ul>
                            <li className='bg-orange-300'>
                            List of teaching classes
                            </li>
                        </ul>
                    </div></>}


        </div>
    )
}
