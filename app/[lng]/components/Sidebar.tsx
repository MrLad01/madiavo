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
  ChevronUp,
  ArrowBigRight
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

// Type definitions
interface MenuItem {
  icon: React.ReactNode;
  title: string;
  href: string;
  hasSubmenu?: boolean;
  submenu?: MenuItem[];
  isExpandable?: boolean;
  items?: MenuItem[];
}

interface MenuCategory {
  title?: string;
  isExpandable?: boolean;
  items: MenuItem[];
}

interface SidebarProps {
  isAdmin?: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}



export default function Sidebar({ isAdmin: admin }: SidebarProps) {
  const { t } = useT('common');
  const lng = useParams()?.lng;
  
  const [isAdmin, setIsAdmin] = useState(admin);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('authUser');
    if (user) {
      const parsedUser = JSON.parse(user);
      if(parsedUser.role === 'admin') {
        setIsAdmin(true);
      }
      setUser(parsedUser);
    }
  }, [])

  console.log(isAdmin);
  
  console.log(user);

  function getAdminContentPath(): string {
    const pathname = window.location.pathname;
    
    const regex = /^(?:.*?)\/admin\/(.*)$/;
    const match = pathname.match(regex);
    
    // If there's a match and a capture group, return the captured content
    if (match && match[1]) {
      return match[1];
    }
    
    // Return empty string if no match found
    return '';
  }

  // You can also use it directly in components/functions
  function handleAdminRoute() {
    const contentPath = getAdminContentPath();
    
    switch (contentPath) {
      case '':
        return 0;
      case 'projects':
        return 1;
      case 'tasks':
        return 2;
      case 'support':
        return 3;
      case 'leads':
        return 4;
      default:
        return 5;
    }
  }

  function handleAdminRoute2() {
    const contentPath = getAdminContentPath();
    console.log(contentPath);   
    switch (contentPath) {
      case '':
        return '0-0';
      case 'customers':
        return '0-1';
      case 'sales':
        return '0-2';
      case 'sales/proposals':
        return '0-2-0';
      case 'sales/estimates':
        return '0-2-1';
      case 'sales/invoices':
        return '0-2-2';
      case 'sales/payments':
        return '0-2-3';
      case 'sales/credit-notes':
        return '0-2-4';
      case 'sales/items':
        return '0-2-5';
      case 'subscriptions':
        return '0-3';
      case 'expenses':
        return '0-4';
      case 'contracts':
        return '0-5';
      case 'projects':
        return '0-6';
      case 'tasks':
        return '0-7';
      case 'support':
        return '0-8';
      case 'leads':
        return '0-9';
      case 'estimate-request':
        return '0-10';
      case 'knowledge-base':
        return '0-11';
      case 'utilities/media':
        return '1-0';
      case 'utilities/bulk-pdf-export':
        return '1-1';
      case 'utilities/csv-export':
        return '1-2';
      case 'utilities/calendar':
        return '1-3';
      case 'utilities/announcements':
        return '1-4';
      case 'utilities/goals':
        return '1-5';
      case 'utilities/activity-log':
        return '1-6';
      case 'utilities/surveys':
        return '1-7';
      case 'utilities/database-backup':
        return '1-8';
      case 'utilities/ticket-pipe-log':
        return '1-9';
      case 'reports/sales':
        return '2-0';
      case 'reports/customers':
        return '2-1';
      case 'reports/projects':
        return '2-2';
      case 'setup/general':
        return '3-0';
      case 'setup/email':
        return '3-1';
      case 'setup/users':
        return '3-2';
      default:
        return '0-1';
    }
  }

  

  useEffect(() => {
    isAdmin ? setActiveItem(handleAdminRoute2()) : setActiveItem(handleAdminRoute())
  }, [])
   

  const userMenuItems: MenuItem[] = [
    { icon: <Layout size={18} />, title: 'Dashboard', href: `/${lng}/admin` },
    { icon: <BarChart size={18} />, title: 'Projects', href: `/${lng}/admin/projects` },
    { icon: <CheckCircle size={18} />, title: 'Tasks', href: `/${lng}/admin/tasks` },
    { icon: <HelpCircle size={18} />, title: 'Support', href: `/${lng}/admin/support` },
    { icon: <Crosshair size={18} />, title: 'Leads', href: `/${lng}/admin/leads` },
  ];

  // Admin menu categories and items
  const adminMenuCategories: MenuCategory[] = [
    {
      items: [
        { icon: <Layout size={18} />, title: 'Dashboard', href: `/${lng}/admin/` },
        { icon: <Users size={18} />, title: 'Customers', href: `/${lng}/admin/customers` },
        // Changed from a regular item to an expandable item with submenu
        { 
          icon: <ShoppingCart size={18} />, 
          title: 'Sales', 
          href: `/${lng}/admin/sales`,
          isExpandable: true,
          items: [
            { icon: <ArrowBigRight size={18} />, title: 'Proposals', href: `/${lng}/admin/sales/proposals` },
            { icon: <ArrowBigRight size={18} />, title: 'Estimates', href: `/${lng}/admin/sales/estimates` },
            { icon: <ArrowBigRight size={18} />, title: 'Invoices', href: `/${lng}/admin/sales/invoices` },
            { icon: <ArrowBigRight size={18} />, title: 'Payments', href: `/${lng}/admin/sales/payments` },
            { icon: <ArrowBigRight size={18} />, title: 'Credit Notes', href: `/${lng}/admin/sales/credit-notes` },
            { icon: <ArrowBigRight size={18} />, title: 'Items', href: `/${lng}/admin/sales/items` },
          ]
        },
        { icon: <Repeat size={18} />, title: 'Subscriptions', href: `/${lng}/admin/subscriptions` },
        { icon: <FileText size={18} />, title: 'Expenses', href: `/${lng}/admin/expenses` },
        { icon: <FileText size={18} />, title: 'Contracts', href: `/${lng}/admin/contracts` },
        { icon: <BarChart size={18} />, title: 'Projects', href: `/${lng}/admin/projects` },
        { icon: <CheckCircle size={18} />, title: 'Tasks', href: `/${lng}/admin/tasks` },
        { icon: <HelpCircle size={18} />, title: 'Support', href: `/${lng}/admin/support` },
        { icon: <Crosshair size={18} />, title: 'Leads', href: `/${lng}/admin/leads` },
        { icon: <FileText size={18} />, title: 'Estimate Request', href: `/${lng}/admin/estimate-request` },
        { icon: <Book size={18} />, title: 'Knowledge Base', href: `/${lng}/admin/knowledge-base` },
      ]
    },
    {
      title: 'Utilities',
      isExpandable: true,
      items: [
        { icon: <FileText size={18} />, title: 'Media', href: `/${lng}/admin/utilities/media` },
        { icon: <FileText size={18} />, title: 'Bulk PDF Export', href: `/${lng}/admin/utilities/bulk-pdf-export` },
        { icon: <FileText size={18} />, title: 'CSV Export', href: `/${lng}/admin/utilities/csv-export` },
        { icon: <FileText size={18} />, title: 'Calendar', href: `/${lng}/admin/utilities/calendar` },
        { icon: <FileText size={18} />, title: 'Announcements', href: `/${lng}/admin/utilities/announcements` },
        { icon: <FileText size={18} />, title: 'Goals', href: `/${lng}/admin/utilities/goals` },
        { icon: <FileText size={18} />, title: 'Activity Log', href: `/${lng}/admin/utilities/activity-log` },
        { icon: <FileText size={18} />, title: 'Surveys', href: `/${lng}/admin/utilities/surveys` },
        { icon: <FileText size={18} />, title: 'Database Backup', href: `/${lng}/admin/utilities/database-backup` },
        { icon: <FileText size={18} />, title: 'Ticket Pipe Log', href: `/${lng}/admin/utilities/ticket-pipe-log` },
      ]
    },
    {
      title: 'Reports',
      isExpandable: true,
      items: [
        { icon: <PieChart size={18} />, title: 'Sales Reports', href: `/${lng}/admin/reports/sales` },
        { icon: <PieChart size={18} />, title: 'Customer Reports', href: `/${lng}/admin/reports/customers` },
        { icon: <PieChart size={18} />, title: 'Project Reports', href: `/${lng}/admin/reports/projects` },
      ]
    },
    {
      title: 'Setup',
      isExpandable: true,
      items: [
        { icon: <Wrench size={18} />, title: 'General Settings', href: `/${lng}/admin/setup/general` },
        { icon: <Wrench size={18} />, title: 'Email Templates', href: `/${lng}/admin/setup/email` },
        { icon: <Wrench size={18} />, title: 'User Management', href: `/${lng}/admin/setup/users` },
      ]
    }
  ];

  const [activeItem, setActiveItem] = useState<number | string>(0);
  // Added state for expanded items
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
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

  // New function to render menu items that can have submenus
  const renderMenuItem = (item: MenuItem, index: number, catIndex: number) => {
    const itemKey = `${catIndex}-${index}`;
    const isItemActive = activeItem === itemKey;
    
    // For expandable menu items with submenu
    if (item.isExpandable && item.items && item.items.length > 0) {
      const isExpanded = expandedItems[itemKey] || false;
      
      return (
        <div key={itemKey} className="flex flex-col">
          {/* Main menu item button */}
          <div 
            className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-indigo-50 dark:hover:bg-gray-800 ${
              isItemActive ? 'bg-indigo-50 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => {
              setExpandedItems(prev => ({
                ...prev,
                [itemKey]: !isExpanded
              }));
            }}
          >
            <div className="flex items-center">
              <span className={`mr-3 text-gray-600 dark:text-gray-400 ${
                isItemActive ? 'text-indigo-600 dark:text-indigo-400' : ''
              }`}>
                {item.icon}
              </span>
              <span className="text-sm">{t(item.title)}</span>
            </div>
            {item.isExpandable && (
              isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />
            )}
          </div>
          
          {/* Submenu items */}
          {isExpanded && item.items && (
            <div className="pl-3 flex flex-col">
              {item.items.map((subItem, subIndex) => {
                const subItemKey = `${itemKey}-${subIndex}`;
                const isSubItemActive = activeItem === subItemKey;
                
                return (
                  <Link 
                    href={subItem.href} 
                    key={subItemKey}
                    onClick={() => setActiveItem(subItemKey)} 
                    className={`flex items-center px-4 py-2 hover:bg-indigo-50 dark:hover:bg-gray-800 ${
                      isSubItemActive ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className={`mr-3 text-gray-600 dark:text-gray-400 ${
                      isSubItemActive ? 'text-indigo-600 dark:text-indigo-400' : ''
                    }`}>
                      {subItem.icon}
                    </span>
                    <span className="text-sm">{t(subItem.title)}</span>
                    {isSubItemActive && (
                      <div className="ml-auto h-6 w-1 rounded-full bg-indigo-500 dark:bg-indigo-400"></div>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }
    
    // Regular menu item
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
  };

  return (
    <div className={`${isAdmin ? 'min-h-screen pb-44' : 'h-fit pb-44'} w-[22vw] bg-white z-40 dark:bg-gray-900 text-indigo-600 dark:text-gray-200 rounded-xl shadow-lg px-4 py-5 flex flex-col gap-5  ${isAdmin ? 'overflow-y-auto' : ''}`}>
      {/* User Profile */}
      <div className="flex items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-xl gap-3 mb-2">
        <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900">
          <UserRound size={20} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {isAdmin ? user?.name : "Username"}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {isAdmin ? user?.email : "user@gmail.com"}
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
                  {category.items.map((item, index) => (
                    // Use the new renderMenuItem function here
                    renderMenuItem(item, index, catIndex)
                  ))}
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