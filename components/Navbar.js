
import React from 'react'
import { GiTowTruck } from "react-icons/gi";
import Link from 'next/link'
import { GiEarthAmerica } from "react-icons/gi";
import { BsFillBuildingsFill } from "react-icons/bs";
import { TbLogout2 } from "react-icons/tb";
import { RiLogoutCircleFill } from "react-icons/ri";
const Navbar = () => {

  return (
    <div className=' bg-indigo-700 p-3 text-xl flex justify-between'>
    <div className='bg-cyan-500 rounded-xl py-2 px-2 bg-opacity-30 flex flex-row '>
       <span className='text-cyan-500 font-bold'>A</span>
       <span className='text-gray'><GiEarthAmerica className=' bg-green-500 rounded-full text-blue-800' size={25} /></span>
       <span className='text-teal-500 font-bold'> M</span>
       </div>
       
       <GiTowTruck className='text-teal-100' size={50} />

      <Link  href="/" className=' flex justify-center gap-1  font-semibold text-indigo-900 bg-indigo-200 p-2 rounded-full hover:cursor-pointer hover:bg-indigo-300'>
      <RiLogoutCircleFill className='' size={30}/>
        Logout
      </Link>
    </div>
  )
}

export default Navbar;
