'use client'

import { Bell, Clock4, Hamburger, Menu, PlusIcon, Search, Share2, SquareCheckBig } from 'lucide-react'
import React from 'react'
import NavbarLanguageSwitcher from './NavbarLanguageSwitcher'
import NavbarThemeSwitcher from './NavbarThemeSwitcher'
import { useT } from '@/app/i18n/client'

interface NavbarProps {
    hideSidebar: boolean;
    setHideSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Navbar({hideSidebar, setHideSidebar}: NavbarProps) {
  const { t } = useT('common');

  return (
    <div className='w-[98vw] max-md:w-[96vw] border px-4 fixed py-1 max-md:py-3 rounded-xl shadow-md bg-white dark:bg-blue-500 dark:border-0 z-50 flex justify-between items-center'>
        <div className="flex items-center gap-3">
            <button className='cursor-pointer outline-none' title={t('View/Hide Sidebar')} onClick={() => setHideSidebar(!hideSidebar)}>
                <Menu size={18} className="text-indigo-600 dark:text-white" />
            </button>
            <h1 className="text-center text-[2.3rem] font-extrabold max-md:hidden text-indigo-600 dark:text-white tracking-wide ">Madiavo.</h1>
        </div>
        <div className='relative flex items-center gap-2 max-md:hidden'>
            <input type="text" placeholder={`${t(`Search`)}...`} className='border border-[#4f39f660] bg-[#4f39f609] dark:bg-gray-50 dark:text-blue-500 placeholder:text-[#4f39f660] px-5 py-3 w-[26vw] text-sm outline-none rounded-xl text-[#4f39f660] max-md:hidden' />
            <div className="absolute right-4 flex items-center justify-center gap-2">
                <button className='cursor-pointer outline-none rounded-full p-1 bg-white border border-[#4f39f620] dark:border-0' title={t('Search')}>
                    <Search size={20} className='text-[#4f39f680] dark:text-blue-500' />
                </button>
                <button className='cursor-pointer outline-none rounded-full p-1 bg-[#4f39f620] dark:bg-blue-500' title={t('Quick Create')}>
                    <PlusIcon size={20} className='text-white' />
                </button>
            </div>
        </div> 
        <div className='flex items-center justify-center gap-3 max-md:hidden'>
            <NavbarLanguageSwitcher />
            <button className='cursor-pointer outline-none' title={t('Share documents, ideas...')}>
                <Share2 size={18} className='text-indigo-600 dark:text-white' />
            </button>
            <button className='cursor-pointer outline-none' title={t('todo items')}>
                <SquareCheckBig size={18} className='text-indigo-600 dark:text-white' />
            </button>
            <button className='cursor-pointer outline-none' title={t('My Timesheets')}>
                <Clock4 size={18} className='text-indigo-600 dark:text-white' />
            </button>
            <button className='cursor-pointer outline-none' title={t('Notifications')}>
                <Bell size={18} className='text-indigo-600 dark:text-white' />
            </button>
            <NavbarThemeSwitcher />
        </div>
    </div>
  )
}
