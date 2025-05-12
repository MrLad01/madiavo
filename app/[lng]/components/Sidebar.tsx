'use client'
import { BarChart, CheckCircle, HelpCircle, Layout, Crosshair, UserRound, LogOut, Settings } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

export default function Sidebar() {
  const menuItems = [
    { icon: <Layout size={18} />, title: 'Dashboard', href: '/lt/admin' },
    { icon: <BarChart size={18} />, title: 'Projects', href: '/lt/admin/projects' },
    { icon: <CheckCircle size={18} />, title: 'Tasks', href: '/lt/admin/tasks' },
    { icon: <HelpCircle size={18} />, title: 'Support', href: '/lt/admin/support' },
    { icon: <Crosshair size={18} />, title: 'Leads', href: '/lt/admin/leads' },
  ];

  const [activeItem, setActiveItem] = useState(0);

  return (
    <div className="h-fit w-[17vw] bg-white z-50 dark:bg-gray-900 text-indigo-600 dark:text-gray-200 rounded-xl shadow-lg px-4 py-5 flex flex-col gap-5 pb-44 fixed">
      {/* User Profile */}
      <div className="flex items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-xl gap-3 mb-2">
        <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900">
          <UserRound size={20} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">Username</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">user@gmail.com</p>
        </div>
      </div>
      
      {/* Navigation Menu */}
      <div className="flex flex-col gap-2">        
        {menuItems.map((item, index) => (
          <Link 
            href={item.href} 
            key={index}
            onClick={() => setActiveItem(index)} 
            className={`flex items-center px-4 py-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-gray-800 group transition-all duration-200 ${activeItem === index ? 'bg-indigo-50 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-700 dark:text-gray-300'}`}
          >
            <span className={`p-2 rounded-lg mr-3 ${activeItem === index ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`}>
              {item.icon}
            </span>
            <span className="text-sm">{item.title}</span>
            {activeItem === index && (
              <div className="ml-auto h-6 w-1 rounded-full bg-indigo-500 dark:bg-indigo-400"></div>
            )}
          </Link>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="mt-auto flex flex-col gap-2">
        <button className="flex items-center px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-700 dark:text-gray-300 group">
          <span className="p-2 rounded-lg mr-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 group-hover:text-red-600 dark:group-hover:text-red-400">
            <LogOut size={18} />
          </span>
          <span className="text-sm group-hover:text-red-600 dark:group-hover:text-red-400">Logout</span>
        </button>
        
        {/* <button className="flex items-center px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
          <span className="p-2 rounded-lg mr-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
            <Settings size={18} />
          </span>
          <span className="text-sm">Settings</span>
        </button> */}
      </div>
    </div>
  )
}