import Image from 'next/image'
import React from 'react'
import Avatar2 from '@/app/public/images/avatars/avatar2.png'
function Asset() {
  return (
    <div className="hidden lg:flex w-1/2 lg:p-8 xl:p-12 lg:max-w-1/2 pb-6 xl:max-w-lgh-full items-center justify-center" >
      <Image src={Avatar2} width={500} height={500} alt="girl playing ping pong" className='w-full h-full object-cover' />
    </div>
  )
}

export default Asset;