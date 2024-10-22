
import React from 'react'
import Asset from './components/Asset'
import Login from './components/Login'
import WrapperLogout from '../components/Wrapper/Wrapper-logout'

function Auth() {
  return (
    <WrapperLogout>
      <main className='bg-center bg-cover flex min-h-screen' style={{ backgroundImage: "url('/Auth-Background.png')", width: '100vw', height: '100vh' }}>
        <div className=" w-full flex justify-center items-center flex-row  ">
          <Login />
          <Asset />
        </div>
      </main>
    </WrapperLogout>
  )
}

export default Auth;