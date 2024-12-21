
import React from 'react'
import Link from 'next/link'
import { BsFillBuildingsFill } from "react-icons/bs";
import { TbLogout2 } from "react-icons/tb";
const Navbar = () => {

  return (
    <div className=' bg-violet-500 p-3 text-xl flex justify-between'>
    <div className='bg-cyan-500 rounded-xl py-2 px-2 bg-opacity-30'>
       <span className='text-teal-500 font-bold'>Anil</span>
       <span className='text-gray'>Earth</span>
       <span className='text-purple-700 font-bold'>Mover</span>
       </div>
       <BsFillBuildingsFill size={30} />
      

      <Link  href="/" className=' flex justify-center gap-1 font-semibold text-purple-900 bg-purple-200 p-2 rounded-md hover:cursor-pointer hover:bg-purple-300'>
      <TbLogout2 size={25} />
        Logout
      </Link>
    </div>
  )
}

export default Navbar;
