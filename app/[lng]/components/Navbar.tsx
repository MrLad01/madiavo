import { Bell, Clock4, Menu, Plus, Search, Share2, SquareCheckBig, Users, Link } from 'lucide-react'
import React, { useState } from 'react'
import NavbarLanguageSwitcher from './NavbarLanguageSwitcher';
import NavbarThemeSwitcher from './NavbarThemeSwitcher';


interface NavbarTimesheetProps {
  isAdmin: boolean;
}

const NavbarTimesheet = ({ }: NavbarTimesheetProps) => (
  <button className='cursor-pointer outline-none' title='My Timesheets'>
    <Clock4 size={18} className='text-indigo-600 dark:text-white' />
  </button>
)

// Employee Info Modal Component
interface EmployeeInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmployeeInfoModal = ({ isOpen, onClose }: EmployeeInfoModalProps) => {
  const [employees] = useState([
    {
      id: 1,
      name: "John Designer",
      role: "UI/UX Designer",
      driveLink: "https://drive.google.com/designer-folder",
      notes: "Brand guidelines and design assets"
    },
    {
      id: 2,
      name: "Sarah Developer",
      role: "Frontend Developer",
      driveLink: "https://drive.google.com/dev-resources",
      notes: "Code repositories and documentation"
    },
    {
      id: 3,
      name: "Mike Manager",
      role: "Project Manager",
      driveLink: "https://drive.google.com/project-docs",
      notes: "Project timelines and client documents"
    }
  ])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-[#00000090] bg-opacity-50 z-[60] flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-[90vw] max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-indigo-600 dark:text-white">Employee Resources</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4">
          {employees.map(employee => (
            <div key={employee.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">{employee.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{employee.role}</p>
                </div>
                <a 
                  href={employee.driveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Link size={16} />
                  Drive
                </a>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{employee.notes}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

interface NavbarProps {
    hideSidebar: boolean;
    setHideSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Navbar({hideSidebar, setHideSidebar}: NavbarProps) {
  const [isAdmin] = useState(false)
  const [showEmployeeInfo, setShowEmployeeInfo] = useState(false)


  // Mock translation function
  const translations = {
    'View/Hide Sidebar': 'View/Hide Sidebar',
    'Search': 'Search',
    'Quick Create': 'Quick Create',
    'Share documents, ideas...': 'Share documents, ideas...',
    'todo items': 'Todo items',
    'My Timesheets': 'My Timesheets',
    'Notifications': 'Notifications',
    'Employee Resources': 'Employee Resources'
  } as const;

  type TranslationKey = keyof typeof translations;

  const t = (key: string) => {
    if (key in translations) {
      return translations[key as TranslationKey];
    }
    return key;
  }

  return (
    <>
      <div className='w-[98vw] max-md:w-[96vw] px-4 fixed py-1 max-md:py-3 rounded-xl shadow-md bg-white dark:bg-blue-500 dark:border-0 z-50 flex justify-between items-center'>
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
              <Plus size={20} className='text-white' />
            </button>
          </div>
        </div> 
        
        {/* Reordered navigation items for better usability (#4) */}
        <div className='flex items-center justify-center gap-3 max-md:hidden'>
          {/* Most frequently used items first */}
          <button className='cursor-pointer outline-none' title={t('Notifications')}>
            <Bell size={18} className='text-indigo-600 dark:text-white' />
          </button>
          
          <button className='cursor-pointer outline-none' title={t('todo items')}>
            <SquareCheckBig size={18} className='text-indigo-600 dark:text-white' />
          </button>
          
          <NavbarTimesheet isAdmin={isAdmin} />
          
          {/* New Employee Resources tab (#5) */}
          <button 
            className='cursor-pointer outline-none' 
            title={t('Employee Resources')}
            onClick={() => setShowEmployeeInfo(true)}
          >
            <Users size={18} className='text-indigo-600 dark:text-white' />
          </button>
          
          {/* Less frequently used items */}
          <button className='cursor-pointer outline-none' title={t('Share documents, ideas...')}>
            <Share2 size={18} className='text-indigo-600 dark:text-white' />
          </button>
          
          {/* Settings and preferences at the end */}
          <NavbarLanguageSwitcher />
          <NavbarThemeSwitcher />
        </div>
      </div>
      
      {/* Employee Info Modal (#5) */}
      <EmployeeInfoModal 
        isOpen={showEmployeeInfo} 
        onClose={() => setShowEmployeeInfo(false)} 
      />
    </>
  )
}