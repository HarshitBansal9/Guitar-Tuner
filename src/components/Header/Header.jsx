import React from 'react'

function Header() {
  return (
    <div className='h-[100px] w-full flex items-center flex-row bg-background'>
        <div className="text-4xl text-white font-bold ml-10">Tuner.</div>
        <div className='flex flex-row absolute right-10'>
            <div className='text-white text-xl mr-6 hover:cursor-pointer hover:text-gray-500'>About</div>
            <div className='text-white text-xl mr-6 hover:cursor-pointer hover:text-gray-500'>Support</div>
            <div className='text-white text-xl mr-6 hover:cursor-pointer hover:text-gray-500'>Login</div>
        </div>
    </div>
  )
}

export default Header
