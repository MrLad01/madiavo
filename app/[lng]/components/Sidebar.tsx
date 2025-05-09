import { ChartBarIncreasing, CircleCheck, CircleHelp, CircuitBoard, Crosshair, UserRound } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function Sidebar() {
  return (
    <div className='h-fit w-[17vw] bg-[#ffffff60] text-indigo-600 dark:text-gray-200 dark:bg-gray-800 dark:border dark:border-gray-600 rounded-2xl shadow-md px-2 py-3 flex flex-col gap-3 items-center pb-44 fixed'>
        <button className='flex items-center bg-white cursor-pointer w-full p-2.5 rounded-xl dark:bg-gray-700 shadow-sm gap-2 mb-5'>
            <div className='p-2 rounded-full bg-[#4f39f610] dark:bg-gray-500'>
                <UserRound size={20} className='text-indigo-600 dark:text-white' />
            </div>
            <div className="flex flex-col">
                <h3 className='text-[12px] font-semibold opacity-80'>Username</h3>
                <h3 className='text-[12px]'>User gmail</h3>
            </div>
        </button>
        <Link href={'/lt/admin'} className='flex items-center bg-white cursor-pointer w-full py-3.5 pl-12 rounded-3xl dark:bg-gray-700 shadow-xs text-sm hover:bg-indigo-600 dark:hover:bg-blue-500 hover:text-white gap-3 border border-[#4f39f620] dark:border-0'>
            <CircuitBoard size={20} />
            <span>Dashboard</span>
        </Link>
        <Link href={'/lt/admin'} className='flex items-center bg-white cursor-pointer w-full py-3.5 pl-12 rounded-3xl dark:bg-gray-700 shadow-xs text-sm hover:bg-indigo-600 dark:hover:bg-blue-500 hover:text-white gap-3 border border-[#4f39f620] dark:border-0'>
            <ChartBarIncreasing  size={20} />
            <span>Projects</span>
        </Link>
        <Link href={'/lt/admin'} className='flex items-center bg-white cursor-pointer w-full py-3.5 pl-12 rounded-3xl dark:bg-gray-700 shadow-xs text-sm hover:bg-indigo-600 dark:hover:bg-blue-500 hover:text-white gap-3 border border-[#4f39f620] dark:border-0'>
            <CircleCheck size={20} />
            <span>Tasks</span>
        </Link>
        <Link href={'/lt/admin'} className='flex items-center bg-white cursor-pointer w-full py-3.5 pl-12 rounded-3xl dark:bg-gray-700 shadow-xs text-sm hover:bg-indigo-600 dark:hover:bg-blue-500 hover:text-white gap-3 border border-[#4f39f620] dark:border-0'>
            <CircleHelp size={20} />
            <span>Support</span>
        </Link>
        <Link href={'/lt/admin'} className='flex items-center bg-white cursor-pointer w-full py-3.5 pl-12 rounded-3xl dark:bg-gray-700 shadow-xs text-sm hover:bg-indigo-600 dark:hover:bg-blue-500 hover:text-white gap-3 border border-[#4f39f620] dark:border-0'>
            <Crosshair size={20} />
            <span>Leads</span>
        </Link>
    </div>
  )
}
