'use client'
import { ArrowRight, ArrowUpDown, Filter, Plus, RotateCw, Search, Tag, Upload, X } from 'lucide-react'
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
  jmonesKodas: string;
  adresas: string;
  pvmMoketi: string;
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
    jmonesKodas: 'a',
    adresas: 'a',
    pvmMoketi: ''
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
    jmonesKodas: 'a',
    adresas: 'a',
    pvmMoketi: ''
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
    jmonesKodas: 'a',
    adresas: 'a',
    pvmMoketi: ''
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
    jmonesKodas: 'a',
    adresas: 'a',
    pvmMoketi: ''
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
    jmonesKodas: 'a',
    adresas: 'a',
    pvmMoketi: ''
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
    jmonesKodas: 'a',
    adresas: 'a',
    pvmMoketi: ''
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
        <button className="bg-gray-800 text-white text-sm px-4 py-2 rounded-md flex items-center cursor-pointer">
          <Filter size={16} className="mr-2" /> Filters
        </button>
      </div>
      
      {/* Table controls */}
      <div className="bg-gray-900 rounded-md mt-6 overflow-x-auto">
        <div className="flex justify-between p-4 border-b border-gray-800 text-sm">
          <div className="flex items-center gap-2">
            <select className="bg-gray-800 text-white border border-gray-700 rounded-md p-2">
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
            <button className="bg-gray-800 text-white border border-gray-700 px-4 py-2 rounded-md">
              Export
            </button>
            <button className="bg-gray-800 text-white border border-gray-700 px-4 py-2 rounded-md">
              Bulk Actions
            </button>
            <button className="bg-gray-800 text-white border border-gray-700 p-2 rounded-md">
              <RotateCw size={14} />
            </button>
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            />
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-800 border-b border-gray-700">
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={() => setSelectAll(!selectAll)}
                    className="rounded"
                  />
                </th>
                <th className="p-4 text-sm font-medium text-gray-300 min-w-12 cursor-pointer" onClick={() => requestSort('id')}>
                  <div className="flex items-center">
                    # <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-4 text-sm font-medium text-gray-300 min-w-32 cursor-pointer" onClick={() => requestSort('company')}>
                  <div className="flex items-center">
                    Company <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-4 text-sm font-medium text-gray-300 min-w-40 cursor-pointer" onClick={() => requestSort('primaryContact')}>
                  <div className="flex items-center">
                    Primary Contact <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-4 text-sm font-medium text-gray-300 min-w-40 cursor-pointer" onClick={() => requestSort('primaryEmail')}>
                  <div className="flex items-center">
                    Primary Email <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-4 text-sm font-medium text-gray-300 min-w-32 cursor-pointer" onClick={() => requestSort('phone')}>
                  <div className="flex items-center">
                    Phone <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-4 text-sm font-medium text-gray-300 min-w-24 cursor-pointer" onClick={() => requestSort('active')}>
                  <div className="flex items-center">
                    Active <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-4 text-sm font-medium text-gray-300 min-w-24 cursor-pointer" onClick={() => requestSort('groups')}>
                  <div className="flex items-center">
                    Groups <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-4 text-sm font-medium text-gray-300 min-w-36 cursor-pointer" onClick={() => requestSort('dateCreated')}>
                  <div className="flex items-center">
                    Date Created <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-4 text-sm font-medium text-gray-300 min-w-32 cursor-pointer" onClick={() => requestSort('jmonesKodas')}>
                  <div className="flex items-center">
                    Įmonės kodas <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-4 text-sm font-medium text-gray-300 min-w-32 cursor-pointer" onClick={() => requestSort('adresas')}>
                  <div className="flex items-center">
                    Adresas <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-4 text-sm font-medium text-gray-300 min-w-32 cursor-pointer" onClick={() => requestSort('pvmMoketi')}>
                  <div className="flex items-center">
                    PVM mokėti <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr 
                  key={customer.id} 
                  className="border-b border-gray-800 hover:bg-gray-800" 
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
                  <td className="p-4 text-gray-300">{customer.id}</td>
                  <td className="p-4 text-gray-300 relative">
                    {customer.company}
                    {hoveredRow === customer.id && (
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button className="bg-blue-600 text-white text-xs px-2 py-1 rounded">View</button>
                        <button className="bg-gray-600 text-white text-xs px-2 py-1 rounded">Edit</button>
                        <button className="bg-red-600 text-white text-xs px-2 py-1 rounded">Delete</button>
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-gray-300">
                                        {  customer.primaryContact
                    }
                  </td>
                  <td className="p-4 text-gray-300">{customer.primaryEmail}</td>
                  <td className="p-4 text-gray-300">{customer.phone}</td>
                  <td className="p-4">
                    <div 
                      className={`w-12 h-6 rounded-full ${customer.active ? 'bg-green-500' : 'bg-gray-700'}  p-1 cursor-pointer`}
                      onClick={() => toggleStatus(customer.id)}
                    >
                      <div className={`w-4 h-4 rounded-full transition-transform  ${customer.active ? 'bg-white transform translate-x-6' : 'bg-white'}`}></div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">{customer.groups.join(', ')}</td>
                  <td className="p-4 text-gray-300">{formatDate(customer.dateCreated)}</td>
                  <td className="p-4 text-gray-300">{customer.jmonesKodas}</td>
                  <td className="p-4 text-gray-300">{customer.adresas}</td>
                  <td className="p-4 text-gray-300">{customer.pvmMoketi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex justify-between p-4">
          <span className="text-gray-400">Showing 1 to {filteredCustomers.length} of {filteredCustomers.length} entries</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-gray-800 text-gray-400 border border-gray-700 rounded-md">Previous</button>
            <button className="px-3 py-1 bg-blue-500 text-white border border-gray-700 rounded-md">1</button>
            <button className="px-3 py-1 bg-gray-800 text-gray-400 border border-gray-700 rounded-md">Next</button>
          </div>
        </div>
      </div>

      {showNewCustomerModal &&(
      <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
        <div className="dark:bg-gray-800 bg-white border border-gray-700 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center bg-blue-400 p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Add New Lead</h2>
            <button 
              onClick={() => setShowNewCustomerModal(false)} 
              className="text-gray-400 hover:text-white"
            >
              <X size={20} color='#fff' />
            </button>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleAddNewCustomer}>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block mb-1 text-xs text-gray-400">
                    <span className="text-red-500">*</span> Status
                  </label>
                  <div className="relative">
                    <select className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600">
                      <option>Darsinama</option>
                      <option>New</option>
                      <option>Contacted</option>
                      <option>Qualified</option>
                      <option>Working</option>
                      <option>Clients</option>
                      <option>Lost</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block mb-1 text-xs text-gray-400">
                    <span className="text-red-500">*</span> Source
                  </label>
                  <div className="relative">
                    <select className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600">
                      <option>Google</option>
                      <option>Website</option>
                      <option>Referral</option>
                      <option>Trade Show</option>
                      <option>Email Campaign</option>
                      <option>Cold Call</option>
                      <option>Partner Referral</option>
                    </select>
                  </div>
                </div>
              <div className="mb-4">
                <label className="block mb-1 text-xs text-gray-400">
                  Assigned
                </label>
                <div className="relative">
                  <select className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600">
                    <option>Abraham A.</option>
                    <option>Sarah Johnson</option>
                    <option>Mike Chen</option>
                    <option>Jessica Lee</option>
                    <option>David Williams</option>
                  </select>
                </div>
              </div>
              </div>
              
              
              <div className="mb-4">
                <label className=" mb-1 text-xs text-gray-400 flex items-center gap-1.5">
                  <Tag size={14} />
                  Tags
                </label>
                <input 
                  type="text" 
                  placeholder="Tag" 
                  className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1 text-xs text-gray-400">
                    <span className="text-red-500">*</span> Name
                  </label>
                  <input 
                    type="text" 
                    required
                    className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-xs text-gray-400">
                    Address
                  </label>
                  <input 
                    type="text" 
                    className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1 text-xs text-gray-400">
                    Position
                  </label>
                  <input 
                    type="text" 
                    className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-xs text-gray-400">
                    City
                  </label>
                  <input 
                    type="text" 
                    className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1 text-xs text-gray-400">
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-xs text-gray-400">
                    State
                  </label>
                  <input 
                    type="text" 
                    className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1 text-xs text-gray-400">
                    Website
                  </label>
                  <input 
                    type="url" 
                    className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-xs text-gray-400">
                    Country
                  </label>
                  <div className="relative">
                    <select className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600">
                      <option>Lithuania</option>
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>Germany</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1 text-xs text-gray-400">
                    Phone
                  </label>
                  <input 
                    type="tel" 
                    className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-xs text-gray-400">
                    Zip Code
                  </label>
                  <input 
                    type="text" 
                    className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1 text-xs text-gray-400">
                    Lead value
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 pl-6 dark:text-white text-gray-600"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">$</span>
                  </div>
                </div>
                
                <div>
                  <label className="block mb-1 text-xs text-gray-400">
                    Default Language
                  </label>
                  <div className="relative">
                    <select className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600">
                      <option>System Default</option>
                      <option>English</option>
                      <option>Lithuanian</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block mb-1 text-xs text-gray-400">
                  Company
                </label>
                <input 
                  type="text" 
                  className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600"
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1 text-xs text-gray-400">
                  Description
                </label>
                <textarea 
                  className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600 h-24"
                />
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="publicCheckbox"
                    className="mr-2"
                  />
                  <label htmlFor="publicCheckbox" className="dark:text-gray-300 text-gray-600">Public</label>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="contactedToday"
                    className="mr-2"
                    checked
                  />
                  <label htmlFor="contactedToday" className="dark:text-gray-300 text-gray-600">Contacted Today</label>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 dark:border-t border-gray-700 pt-4 mt-4">
                <button 
                  type="button"
                  onClick={() => setShowNewCustomerModal(false)} 
                  className="px-4 py-2 dark:text-gray-300 text-gray-600 rounded dark:hover:bg-gray-700 dark:bg-gray-600 bg-gray-200"
                >
                  Close
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
        )
      }

    </div>

  )
}