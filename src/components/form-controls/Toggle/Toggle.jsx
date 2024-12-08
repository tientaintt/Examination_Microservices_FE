import React, { memo, useState } from 'react'

function Toggle({ children, handleToggle, checked }) {
      const [isChecked, setIsChecked] = useState(false||checked)

      const handleCheckboxChange = () => {
            setIsChecked(!isChecked) // isChecked chưa thay rồi vì phải render hết script thì value mới thay đổi
            // Nên ở đây vẫn phải phủ định (!isChecked)
            handleToggle(!isChecked) //=> Callback function
      }

      return (
            <>
                  <label className='autoSaverSwitch relative inline-flex cursor-pointer select-none items-center'>
                        <input
                              type='checkbox'
                              name='autoSaver'
                              className='sr-only'
                              checked={isChecked}
                              onChange={handleCheckboxChange}
                        />
                        <span
                              className={`slider mr-3 flex h-[26px] w-[50px] items-center rounded-full p-1 duration-200 ${isChecked ? 'bg-[#3232cf]' : 'bg-[#CCCCCE]'
                                    }`}
                        >
                              <span
                                    className={`dot h-[18px] w-[18px] rounded-full bg-white duration-200 ${isChecked ? 'translate-x-6' : ''
                                          }`}
                              ></span>
                        </span>
                        <span className='label flex items-center text-sm font-medium text-black'>
                              {children}
                        </span>
                  </label>
            </>
      )
}

export default memo(Toggle)
