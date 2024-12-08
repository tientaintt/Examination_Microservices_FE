import React from 'react'
import { Header } from '../../components/form-controls/Nav/Header'
import { Outlet } from 'react-router-dom'

function Student() {
      return (
            <>
                  <Header />
                  <hr className='pt-20' />
                  <Outlet />
            </>
      )
}

export default Student