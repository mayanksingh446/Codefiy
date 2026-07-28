import React from 'react'
import { Brain,Sun } from 'lucide-react';

const Navbar = () => {
  return (
   <>
        <div className="nav flex items-center justify-between h-[90px] bg-zinc-900" style={{ padding: "0px 150px" }}>
            <div className="logo flex items-center gap-[10px]">
                <Brain size={40} color='#9333ea'/>
                <span className='text-2xl font-bold text-white ml-2'>Codeify</span>
            </div>
            <div className="icons flex items-center gap-[20px]">
                <i className='cursor-pointer transition-all hover:text-[#9333ea]'> <Sun /></i>
             {/* 🎯 Without transition-all
                         Hover → Color changes immediately (no animation)
                🎯 With transition-all
                Hover → Color fades smoothly */}
            </div>
        </div>
   </>
  )
}

export default Navbar
