import {  ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function page() {
  return (
    <div className='flex-1 ml-[20vw] pb-16 pr-6 flex flex-col text-indigo-600 dark:text-gray-100 gap-2'>
    <div>
      <h1 className='text-2xl font-bold'>Tasks</h1>
      <Link href={`/`} className='flex items-center gap-2 py-1 '>
      <p className='text-sm dark:text-gray-300 text-indigo-600'>Task Overview  </p>
      <ArrowRight size={16} />
      </Link>
    </div>
    <div className='flex gap-2'>
      <div className='flex items-center w-[19%] border border-gray-400 dark:border-gray-50/20 bg-white px-4 rounded-xl dark:bg-gray-800/50 shadow-xs hover:bg-gray-100 dark:hover:bg-gray-400 hover:text-indigo-700 dark:hover:text-blue-200 cursor-pointer'>
        <div className='flex flex-col p-2 '>
          <h2 className=' text-sm font-medium'> 0 <span className='text-yellow-400 ml-1.5'>Not started</span></h2>
          <p className='text-sm font-normal'>My Tasks: 0</p>
        </div>
      </div>
      <div className='flex items-center w-[19%] border border-gray-400 dark:border-gray-50/20 bg-white px-4 rounded-xl dark:bg-gray-800/50 shadow-xs hover:bg-gray-100 dark:hover:bg-gray-400 hover:text-indigo-700 dark:hover:text-blue-200 cursor-pointer'>
        <div className='flex flex-col p-2 '>
          <h2 className=' text-sm font-medium'> 0 <span className='text-purple-800 ml-1.5'>In Progress</span></h2>
          <p className='text-sm font-normal'>My Tasks: 0</p>
        </div>
      </div>
      <div className='flex items-center w-[19%] border border-gray-400 dark:border-gray-50/20 bg-white px-4 rounded-xl dark:bg-gray-800/50 shadow-xs hover:bg-gray-100 dark:hover:bg-gray-400 hover:text-indigo-700 dark:hover:text-blue-200 cursor-pointer'>
        <div className='flex flex-col p-2 '>
          <h2 className=' text-sm font-medium'> 0 <span className='text-blue-400 ml-1.5'>Testing</span></h2>
          <p className='text-sm font-normal'>My Tasks: 0</p>
        </div>
      </div>
      <div className='flex items-center w-[19%] border border-gray-400 dark:border-gray-50/20 bg-white px-4 rounded-xl dark:bg-gray-800/50 shadow-xs hover:bg-gray-100 dark:hover:bg-gray-400 hover:text-indigo-700 dark:hover:text-blue-200 cursor-pointer'>
        <div className='flex flex-col p-2 '>
          <h2 className=' text-sm font-medium'> 0 <span className='text-green-400 ml-1.5'>Awaiting Feedback</span></h2>
          <p className='text-sm font-normal'>My Tasks: 0</p>
        </div>
      </div>
      <div className='flex items-center w-[19%] border border-gray-400 dark:border-gray-50/20 bg-white px-4 rounded-xl dark:bg-gray-800/50 shadow-xs hover:bg-gray-100 dark:hover:bg-gray-400 hover:text-indigo-700 dark:hover:text-blue-200 cursor-pointer'>
        <div className='flex flex-col p-2 '>
          <h2 className=' text-sm font-medium'> 0 <span className='text-[#84C544] ml-1.5'>Complete</span></h2>
          <p className='text-sm font-normal'>My Tasks: 0</p>
        </div>
      </div>
    </div>
    </div>
  )
}
