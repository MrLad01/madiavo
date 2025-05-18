'use client'
import { ArrowRight, ArrowUpDown, ChevronDown, Filter, Info, Plus, RotateCw, Search, Tag, Upload, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import _ from 'lodash'
import Link from 'next/link';

// Define TypeScript interfaces for our data
interface Customer {
  id: number;
  company: string;
  primaryContact: string;
  primaryEmail: string;
  phone: string;
  active: boolean;
  groups: string[];
  dateCreated: string;
  CompanyCode: string;
  address: string;
  VATcode: string;
}

interface SortConfig {
  key: keyof Customer | null;
  direction: 'ascending' | 'descending' | null;
}

const dummyCustomers: Customer[] = [
  {
    id: 17,
    company: 'Init',
    primaryContact: '',
    primaryEmail: '',
    phone: '',
    active: true,
    groups: [],
    dateCreated: '2025-05-15 19:34:33',
    CompanyCode: 'a',
    address: 'a',
    VATcode: ''
  },
  {
    id: 22,
    company: 'Invinso',
    primaryContact: '',
    primaryEmail: '',
    phone: '',
    active: true,
    groups: [],
    dateCreated: '2025-05-15 19:37:25',
    CompanyCode: 'a',
    address: 'a',
    VATcode: ''
  },
  {
    id: 21,
    company: 'Mrwoo',
    primaryContact: '',
    primaryEmail: '',
    phone: '',
    active: true,
    groups: [],
    dateCreated: '2025-05-15 19:37:00',
    CompanyCode: 'a',
    address: 'a',
    VATcode: ''
  },
  {
    id: 19,
    company: 'Perfektmedia',
    primaryContact: '',
    primaryEmail: '',
    phone: '',
    active: true,
    groups: [],
    dateCreated: '2025-05-15 19:36:25',
    CompanyCode: 'a',
    address: 'a',
    VATcode: ''
  },
  {
    id: 20,
    company: 'Puoškis',
    primaryContact: '',
    primaryEmail: '',
    phone: '',
    active: true,
    groups: [],
    dateCreated: '2025-05-15 19:36:41',
    CompanyCode: 'a',
    address: 'a',
    VATcode: ''
  },
  {
    id: 23,
    company: 'Ranonis',
    primaryContact: '',
    primaryEmail: '',
    phone: '',
    active: true,
    groups: [],
    dateCreated: '2025-05-15 19:37:37',
    CompanyCode: 'a',
    address: 'a',
    VATcode: ''
  }
];

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>(dummyCustomers);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(dummyCustomers);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: null });
  const [activeCustomers, setActiveCustomers] = useState<number>(7);
  const [totalCustomers, setTotalCustomers] = useState<number>(7);
  const [inactiveCustomers, setInactiveCustomers] = useState<number>(0);
  const [activeContacts, setActiveContacts] = useState<number>(0);
  const [inactiveContacts, setInactiveContacts] = useState<number>(0);
  const [contactsLoggedIn, setContactsLoggedIn] = useState<number>(0);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [showNewCustomerModal, setShowNewCustomerModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState('details');


  // Select/deselect all rows
  useEffect(() => {
    if (selectAll) {
      setSelectedRows(filteredCustomers.map(customer => customer.id));
    } else {
      setSelectedRows([]);
    }
  }, [selectAll, filteredCustomers]);

  // Handle row selection
  const toggleRowSelection = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Handle toggle status change
  const toggleStatus = (id: number) => {
    const updatedCustomers = customers.map(customer =>
      customer.id === id ? { ...customer, active: !customer.active } : customer
    );
    setCustomers(updatedCustomers);
    setFilteredCustomers(updatedCustomers);
  };

  // Handle column sorting
  const requestSort = (key: keyof Customer | null) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    // Apply sorting
    const sortedItems = [...filteredCustomers].sort((a, b) => {
      if (!key) return 0;
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setFilteredCustomers(sortedItems);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const parts = dateString.split(' ');
    if (parts.length === 2) {
      return (
        <div className="flex flex-col">
          <span>{parts[0]}</span>
          <span>{parts[1]}</span>
        </div>
      );
    }
    return dateString;
  };

  const handleAddNewCustomer = (e: React.FormEvent) => {
      e.preventDefault();
      // Implementation would go here
      setShowNewCustomerModal(false);
    };

  return (
    <div className="flex-1 dark:bg-black bg-white min-h-screen pb-16 pt-6 px-6 flex flex-col text-indigo-600 overflow-x-hidden dark:text-gray-100">
      <div>
      <h1 className="text-2xl font-bold dark:text-gray-300 text-gray-600">Customers</h1>
      <Link href="/" className="flex items-center gap-2 py-1">
          <p className="text-sm dark:text-gray-300 text-gray-600">Contacts</p>
          <ArrowRight size={16} className='dark:text-gray-300 text-gray-600' />
        </Link>
      </div>
      
      {/* Stat boxes */}
      <div className="flex gap-2 mt-4 text-sm">
        <div className="dark:bg-inherit bg-white border border-gray-500 flex items-center justify-start rounded-md py-2 px-3 min-w-44">
          <p className="dark:text-white text-gray-600"><span className="font-normal">7</span> Total Customers</p>
        </div>
        <div className="dark:bg-inherit bg-white border border-gray-500 flex items-center justify-start rounded-md py-2 px-3 min-w-44">
          <p><span className="dark:text-white text-gray-600 ">7</span> <span className="text-green-500 font-extralight">Active Customers</span></p>
        </div>
        <div className="dark:bg-inherit bg-white border border-gray-500 flex items-center justify-start rounded-md py-2 px-3 min-w-44">
          <p><span className="dark:text-white text-gray-600">0</span> <span className="text-red-500 font-extralight">Inactive Customers</span></p>
        </div>
        <div className="dark:bg-inherit bg-white border border-gray-500 flex items-center justify-start rounded-md py-2 px-3 min-w-44">
          <p><span className="dark:text-white text-gray-600">0</span> <span className="text-blue-500 font-extralight">Active Contacts</span></p>
        </div>
        <div className="dark:bg-inherit bg-white border border-gray-500 flex items-center justify-start rounded-md py-2 px-3 min-w-44">
          <p><span className="dark:text-white text-gray-600">0</span> <span className="text-red-500 font-extralight">Inactive Contacts</span></p>
        </div>
        <div className="dark:bg-inherit bg-white border border-gray-500 flex items-center justify-start rounded-md py-2 px-3 min-w-44">
          <p className=" text-gray-400"><span className="dark:text-white text-gray-600">0</span> Contacts Logged In Today</p>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex mt-6 justify-between">
        <div className="flex gap-2">
          <button onClick={() => setShowNewCustomerModal(true)} className="flex items-center justify-between text-xs px-3 py-2 cursor-pointer rounded-lg bg-blue-500 text-white hover:bg-blue-600">
            <Plus size={16} className="mr-2"  /> New Customer
          </button>
          <button className="flex items-center justify-between text-xs px-3 py-2 cursor-pointer rounded-lg bg-white dark:bg-transparent dark:text-gray-200 text-gray-600 border border-gray-400 dark:hover:bg-gray-700">
            <Upload size={16} className="mr-2" /> Import Customers
          </button>
        </div>
        <button className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg border border-gray-400 text-gray-500 shadow-sm text-xs dark:text-gray-200 dark:bg-transparent bg-white hover:bg-gray-100 dark:hover:bg-gray-500 dark:hover:text-blue-200">
          <Filter size={16} className="mr-2" /> Filters
        </button>
      </div>
      
      {/* Table controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 mt-4 overflow-x-auto relative">
        <div className="flex justify-between p-4 border-b bg-white dark:bg-transparent border-gray-200 dark:border-gray-700 text-sm">
          <div className="flex items-center gap-2">
            <select className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
            <button className="px-4 py-1 border cursor-pointer border-gray-400 text-xs rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800">
              Export
            </button>
            <button className="px-4 py-1 border rounded-md cursor-pointer text-gray-700 text-xs dark:text-gray-300 bg-white dark:bg-gray-800">
              Bulk Actions
            </button>
            <button className="p-1 border rounded-md cursor-pointer text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800">
              <RotateCw size={12} />
            </button>
          </div>
          <div className="relative">
            <Search size={12} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-xs bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            />
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left ">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600 py-1">
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={() => setSelectAll(!selectAll)}
                    className="rounded"
                  />
                </th>
                <th className="p-4 text-sm font-medium text-gray-400 min-w-12 cursor-pointer" onClick={() => requestSort('id')}>
                  <div className="flex items-center">
                    # <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-4 text-sm font-medium text-gray-400 min-w-32 cursor-pointer" onClick={() => requestSort('company')}>
                  <div className="flex items-center">
                    Company <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-4 text-sm font-medium text-gray-400 min-w-40 cursor-pointer" onClick={() => requestSort('primaryContact')}>
                  <div className="flex items-center">
                    Primary Contact <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-4 text-sm font-medium text-gray-400 min-w-40 cursor-pointer" onClick={() => requestSort('primaryEmail')}>
                  <div className="flex items-center">
                    Primary Email <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-4 text-sm font-medium text-gray-400 min-w-32 cursor-pointer" onClick={() => requestSort('phone')}>
                  <div className="flex items-center">
                    Phone <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-4 text-sm font-medium text-gray-400 min-w-24 cursor-pointer" onClick={() => requestSort('active')}>
                  <div className="flex items-center">
                    Active <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-4 text-sm font-medium text-gray-400 min-w-24 cursor-pointer" onClick={() => requestSort('groups')}>
                  <div className="flex items-center">
                    Groups <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-4 text-sm font-medium text-gray-400 min-w-36 cursor-pointer" onClick={() => requestSort('dateCreated')}>
                  <div className="flex items-center">
                    Date Created <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-4 text-sm font-medium text-gray-400 min-w-32 cursor-pointer" onClick={() => requestSort('CompanyCode')}>
                  <div className="flex items-center">
                    Company Code <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-4 text-sm font-medium text-gray-400 min-w-32 cursor-pointer" onClick={() => requestSort('address')}>
                  <div className="flex items-center">
                    Address <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-4 text-sm font-medium text-gray-400 min-w-32 cursor-pointer" onClick={() => requestSort('VATcode')}>
                  <div className="flex items-center">
                    VAT <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className='text-sm'>
              {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <tr 
                  key={customer.id} 
                  className="border-b  border-gray-500  dark:hover:bg-gray-800 py-1" 
                  onMouseEnter={() => setHoveredRow(customer.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(customer.id)}
                      onChange={() => toggleRowSelection(customer.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-300">{customer.id}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-300">
                    {customer.company}
                    {hoveredRow === customer.id && (
                      <div className="absolute top-12 right-2 flex gap-1">
                        <button className=" text-gray-400 text-xs px-2 py-1 cursor-pointer rounded">View</button>
                        <button className=" text-gray-400 text-xs px-2 py-1 cursor-pointer rounded">Edit</button>
                        <button className=" text-gray-400 text-xs px-2 py-1 cursor-pointer rounded">Delete</button>
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-300">
                  { customer.primaryContact}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-300">{customer.primaryEmail}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-300">{customer.phone}</td>
                  <td className="p-4">
                    <div 
                      className={`w-12 h-6 rounded-full ${customer.active ? 'bg-green-500' : 'bg-gray-700'}  p-1 cursor-pointer`}
                      onClick={() => toggleStatus(customer.id)}
                    >
                      <div className={`w-4 h-4 rounded-full transition-transform  ${customer.active ? 'bg-white transform translate-x-6' : 'bg-white'}`}></div>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-300">{customer.groups.join(', ')}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-300">{formatDate(customer.dateCreated)}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-300">{customer.CompanyCode}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-300">{customer.address}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-300">{customer.VATcode}</td>
                </tr>
              ))
              ) : (
              <tr>
                <td colSpan={13} className="px-3 py-16 text-center text-gray-500 dark:text-gray-400">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-20 h-20 mb-4 text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
                          <path d="M13 8L9 12l4 4" />
                        </svg>
                      </div>
                    <p className="text-lg font-medium">No entries found</p>
                    <p className="mt-1 text-xs">Try adjusting your filters or search terms</p>
                  </div>
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex justify-between p-4">
          <span className="text-xs text-gray-500 dark:text-gray-400">Showing 1 to {filteredCustomers.length} of {filteredCustomers.length} entries</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50">Previous</button>
            <button className="px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-blue-500 text-white hover:bg-blue-600">1</button>
            <button className='px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'>Next</button>
          </div>
        </div>
      </div>

      {showNewCustomerModal &&
      (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800  border border-gray-700 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center bg-blue-400 p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Add New Customer</h2>
          <button 
            onClick={() => setShowNewCustomerModal(false)} 
            className="text-gray-400 hover:text-white"
          >
            <X size={20} color='#fff' />
          </button>
        </div>
        
        <div className="dark:bg-gray-800 bg-white px-6 py-3">
          <div className="flex">
            <button
              className={`py-2 px-4 ${activeTab === 'details' ? 'dark:text-white text-gray-700 border-b-2 border-blue-500' : 'text-gray-400'}`}
              onClick={() => setActiveTab('details')}
            >
              Customer Details
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'custom' ? 'dark:text-white text-gray-700 border-b-2 border-blue-500' : 'text-gray-400'}`}
              onClick={() => setActiveTab('custom')}
            >
              Custom Fields
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'billing' ? 'dark:text-white text-gray-700 border-b-2 border-blue-500' : 'text-gray-400'}`}
              onClick={() => setActiveTab('billing')}
            >
              Billing & Shipping
            </button>
          </div>
        </div>
        
        <div className="p-6 dark:bg-gray-800 bg-white">
          {activeTab === 'details' && (
            <div>
              <div className="mb-4">
                <label className="block mb-1 text-xs text-gray-400">
                  Company
                </label>
                <input 
                  type="text" 
                  className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white"
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1 text-xs text-gray-400">
                  Phone
                </label>
                <input 
                  type="tel" 
                  className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white"
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1 text-xs text-gray-400">
                  Website
                </label>
                <input 
                  type="url" 
                  className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white"
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1 text-xs text-gray-400">
                  Groups
                </label>
                <div className="relative">
                  <select className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white appearance-none">
                    <option>Nothing selected</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className=" mb-1 text-xs text-gray-400 flex items-center">
                    <span className="mr-1">$</span> Currency
                  </label>
                  <div className="relative">
                    <select className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white appearance-none">
                      <option>System Default</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronDown size={16} className="text-gray-400" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block mb-1 text-xs text-gray-400">
                    Default Language
                  </label>
                  <div className="relative">
                    <select className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white appearance-none">
                      <option>System Default</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronDown size={16} className="text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block mb-1 text-xs text-gray-400">
                  Address
                </label>
                <textarea 
                  className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white h-24"
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1 text-xs text-gray-400">
                  City
                </label>
                <input 
                  type="text" 
                  className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white"
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1 text-xs text-gray-400">
                  State
                </label>
                <input 
                  type="text" 
                  className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white"
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1 text-xs text-gray-400">
                  Zip Code
                </label>
                <input 
                  type="text" 
                  className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white"
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1 text-xs text-gray-400">
                  Country
                </label>
                <div className="relative">
                  <select className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white appearance-none">
                    <option>Lithuania</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'custom' && (
            <div>
              <div className="mb-4">
                <label className="flex items-center mb-1 text-xs text-gray-400">
                  <span className="text-red-500 mr-1">*</span> Company Code
                </label>
                <input 
                  type="text" 
                  className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white"
                />
              </div>
              
              <div className="mb-4">
                <label className="flex items-center mb-1 text-xs text-gray-400">
                  <span className="text-red-500 mr-1">*</span> Address
                </label>
                <textarea 
                  className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white h-24"
                />
              </div>
              
              <div className="mb-4">
                <label className="flex items-center mb-1 text-xs text-gray-400">
                  VAT payer code
                </label>
                <input 
                  type="text" 
                  className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white"
                />
              </div>
            </div>
          )}
          
          {activeTab === 'billing' && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="dark:text-white text-gray-600 mb-3">Billing Address</h3>
                
                <div className="mb-2 text-gray-400 text-sm">
                  <label className="inline-flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Same as Customer Info
                  </label>
                </div>
                
                <div className="mb-4">
                  <label className="block mb-1 text-xs text-gray-400">
                    Street
                  </label>
                  <textarea 
                    className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white h-24"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block mb-1 text-xs text-gray-400">
                    City
                  </label>
                  <input 
                    type="text" 
                    className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block mb-1 text-xs text-gray-400">
                    State
                  </label>
                  <input 
                    type="text" 
                    className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block mb-1 text-xs text-gray-400">
                    Zip Code
                  </label>
                  <input 
                    type="text" 
                    className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block mb-1 text-xs text-gray-400">
                    Country
                  </label>
                  <div className="relative">
                    <select className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white appearance-none">
                      <option>Nothing selected</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronDown size={16} className="text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <h3 className="dark:text-white text-gray-600">Shipping Address</h3>
                    <Info size={16} className="text-gray-400 ml-2" />
                  </div>
                  <button 
                    type="button" 
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Copy Billing Address
                  </button>
                </div>
                
                <div className="mb-4">
                  <label className="block mb-1 text-xs text-gray-400">
                    Street
                  </label>
                  <textarea 
                    className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white h-24"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block mb-1 text-xs text-gray-400">
                    City
                  </label>
                  <input 
                    type="text" 
                    className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block mb-1 text-xs text-gray-400">
                    State
                  </label>
                  <input 
                    type="text" 
                    className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block mb-1 text-xs text-gray-400">
                    Zip Code
                  </label>
                  <input 
                    type="text" 
                    className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block mb-1 text-xs text-gray-400">
                    Country
                  </label>
                  <div className="relative">
                    <select className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white appearance-none">
                      <option>Nothing selected</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronDown size={16} className="text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-2 dark:border-t border-gray-700 pt-4 mt-6">
            <button 
              type="button"
              onClick={() => setShowNewCustomerModal(false)} 
              className="px-4 py-2 text-white rounded hover:bg-gray-700 bg-gray-600"
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={handleAddNewCustomer}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {activeTab === 'billing' ? 'Save and create contact' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
        )
      }

    </div>

  )
}