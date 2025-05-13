'use client'
import { useT } from '@/app/i18n/client';
import { 
  BarChart, 
  CheckCircle, 
  HelpCircle, 
  Layout, 
  Crosshair, 
  UserRound, 
  LogOut, 
  Settings,
  FileText,
  Users,
  ShoppingCart,
  Repeat,
  ClipboardList,
  Book,
  Wrench,
  PieChart,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

// Type definitions
interface MenuItem {
  icon: React.ReactNode;
  title: string;
  href: string;
  hasSubmenu?: boolean;
  submenu?: MenuItem[];
}

interface MenuCategory {
  title?: string;
  isExpandable?: boolean;
  items: MenuItem[];
}

interface SidebarProps {
  isAdmin?: boolean;
}

export default function Sidebar({ isAdmin = true }: SidebarProps) {
   const { t } = useT('common')

  const userMenuItems: MenuItem[] = [
    { icon: <Layout size={18} />, title: 'Dashboard', href: '/lt/admin' },
    { icon: <BarChart size={18} />, title: 'Projects', href: '/lt/admin/projects' },
    { icon: <CheckCircle size={18} />, title: 'Tasks', href: '/lt/admin/tasks' },
    { icon: <HelpCircle size={18} />, title: 'Support', href: '/lt/admin/support' },
    { icon: <Crosshair size={18} />, title: 'Leads', href: '/lt/admin/leads' },
  ];

  // Admin menu categories and items
  const adminMenuCategories: MenuCategory[] = [
    {
      items: [
        { icon: <Layout size={18} />, title: 'Dashboard', href: '/lt/admin/' },
        { icon: <Users size={18} />, title: 'Customers', href: '/lt/admin/customers' },
        { icon: <ShoppingCart size={18} />, title: 'Sales', href: '/lt/admin/sales' },
        { icon: <Repeat size={18} />, title: 'Subscriptions', href: '/lt/admin/subscriptions' },
        { icon: <FileText size={18} />, title: 'Expenses', href: '/lt/admin/expenses' },
        { icon: <FileText size={18} />, title: 'Contracts', href: '/lt/admin/contracts' },
        { icon: <BarChart size={18} />, title: 'Projects', href: '/lt/admin/projects' },
        { icon: <CheckCircle size={18} />, title: 'Tasks', href: '/lt/admin/tasks' },
        { icon: <HelpCircle size={18} />, title: 'Support', href: '/lt/admin/support' },
        { icon: <Crosshair size={18} />, title: 'Leads', href: '/lt/admin/leads' },
        { icon: <FileText size={18} />, title: 'Estimate Request', href: '/lt/admin/estimate-request' },
        { icon: <Book size={18} />, title: 'Knowledge Base', href: '/lt/admin/knowledge-base' },
      ]
    },
    {
      title: 'Utilities',
      isExpandable: true,
      items: [
        { icon: <FileText size={18} />, title: 'Media', href: '/lt/admin/utilities/media' },
        { icon: <FileText size={18} />, title: 'Bulk PDF Export', href: '/lt/admin/utilities/bulk-pdf-export' },
        { icon: <FileText size={18} />, title: 'CSV Export', href: '/lt/admin/utilities/csv-export' },
        { icon: <FileText size={18} />, title: 'Calendar', href: '/lt/admin/utilities/calendar' },
        { icon: <FileText size={18} />, title: 'Announcements', href: '/lt/admin/utilities/announcements' },
        { icon: <FileText size={18} />, title: 'Goals', href: '/lt/admin/utilities/goals' },
        { icon: <FileText size={18} />, title: 'Activity Log', href: '/lt/admin/utilities/activity-log' },
        { icon: <FileText size={18} />, title: 'Surveys', href: '/lt/admin/utilities/surveys' },
        { icon: <FileText size={18} />, title: 'Database Backup', href: '/lt/admin/utilities/database-backup' },
        { icon: <FileText size={18} />, title: 'Ticket Pipe Log', href: '/lt/admin/utilities/ticket-pipe-log' },
      ]
    },
    {
      title: 'Reports',
      isExpandable: true,
      items: [
        { icon: <PieChart size={18} />, title: 'Sales Reports', href: '/lt/admin/reports/sales' },
        { icon: <PieChart size={18} />, title: 'Customer Reports', href: '/lt/admin/reports/customers' },
        { icon: <PieChart size={18} />, title: 'Project Reports', href: '/lt/admin/reports/projects' },
      ]
    },
    {
      title: 'Setup',
      isExpandable: true,
      items: [
        { icon: <Wrench size={18} />, title: 'General Settings', href: '/lt/admin/setup/general' },
        { icon: <Wrench size={18} />, title: 'Email Templates', href: '/lt/admin/setup/email' },
        { icon: <Wrench size={18} />, title: 'User Management', href: '/lt/admin/setup/users' },
      ]
    }
  ];

  const [activeItem, setActiveItem] = useState<number | string>(0);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Utilities': false,
    'Reports': false,
    'Setup': false
  });

  const toggleCategory = (category: string): void => {
    setExpandedCategories({
      ...expandedCategories,
      [category]: !expandedCategories[category]
    });
  };

  return (
    <div className={`${isAdmin ? 'min-h-screen pb-44' : 'h-fit pb-44'} w-[22vw] bg-white z-50 dark:bg-gray-900 text-indigo-600 dark:text-gray-200 rounded-xl shadow-lg px-4 py-5 flex flex-col gap-5  ${isAdmin ? 'overflow-y-auto' : ''}`}>
      {/* User Profile */}
      <div className="flex items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-xl gap-3 mb-2">
        <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900">
          <UserRound size={20} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {isAdmin ? "Santos Hirthe" : "Username"}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {isAdmin ? "admin@test.com" : "user@gmail.com"}
          </p>
        </div>
      </div>
      
      {/* Navigation Menu */}
      {!isAdmin ? (
        <div className="flex flex-col gap-2">        
          {userMenuItems.map((item, index) => (
            <Link 
              href={item.href} 
              key={index}
              onClick={() => setActiveItem(index)} 
              className={`flex items-center px-4 py-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-gray-800 group transition-all duration-200 ${activeItem === index ? 'bg-indigo-50 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-700 dark:text-gray-300'}`}
            >
              <span className={`p-2 rounded-lg mr-3 ${activeItem === index ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`}>
                {item.icon}
              </span>
              <span className="text-sm">{t(item.title)}</span>
              {activeItem === index && (
                <div className="ml-auto h-6 w-1 rounded-full bg-indigo-500 dark:bg-indigo-400"></div>
              )}
            </Link>
          ))}
        </div>
      ) : (
        // Admin Navigation
        <div className="flex flex-col">        
          {adminMenuCategories.map((category, catIndex) => (
            <div key={catIndex} className="mb-1">
              {category.title && (
                <div 
                  className="flex items-center justify-between px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer"
                  onClick={() => category.isExpandable && toggleCategory(category.title ?? '')}
                >
                  <span>{t(category.title)}</span>
                  {category.isExpandable && (
                    expandedCategories[category.title] ? 
                      <ChevronUp size={14} /> : 
                      <ChevronDown size={14} />
                  )}
                </div>
              )}
              
              {(!category.isExpandable || (category.title && expandedCategories[category.title])) && (
                <div className="flex flex-col">
                  {category.items.map((item, index) => {
                    const itemKey = `${catIndex}-${index}`;
                    return (
                      <Link 
                        href={item.href} 
                        key={itemKey}
                        onClick={() => setActiveItem(itemKey)} 
                        className={`flex items-center px-4 py-2 hover:bg-indigo-50 dark:hover:bg-gray-800 group transition-all duration-200 ${activeItem === itemKey ? 'bg-indigo-50 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-700 dark:text-gray-300'}`}
                      >
                        <span className={`mr-3 text-gray-600 dark:text-gray-400 ${activeItem === itemKey ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>
                          {item.icon}
                        </span>
                        <span className="text-sm">{t(item.title)}</span>
                        {activeItem === itemKey && (
                          <div className="ml-auto h-6 w-1 rounded-full bg-indigo-500 dark:bg-indigo-400"></div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Bottom Actions (only for user view) */}
      {!isAdmin && (
        <div className="mt-auto flex flex-col gap-2">
          <button className="flex items-center px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-700 dark:text-gray-300 group">
            <span className="p-2 rounded-lg mr-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 group-hover:text-red-600 dark:group-hover:text-red-400">
              <LogOut size={18} />
            </span>
            <span className="text-sm group-hover:text-red-600 dark:group-hover:text-red-400">{t('Logout')}</span>
          </button>
        </div>
      )}

      {/* Project info (only for admin view) */}
      {isAdmin && (
        <div className="mt-auto px-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">SEO Optimization</div>
          <div className="text-xs text-gray-600 dark:text-gray-300">Bernhard-Larkin</div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-2">
            <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '35%' }}></div>
          </div>
        </div>
      )}
    </div>
  )
}