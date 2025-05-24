'use client'
import { ArrowUpDown, ChevronDown, Filter,  Plus, RotateCw, Search, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link';

// Define TypeScript interfaces for our data
interface Subscription {
  id: number;
  name: string;
  customer: string;
  project: string;
  status: 'Active' | 'Not Subscribed' | 'Future' | 'Past Due' | 'Unpaid' | 'Incomplete' | 'Canceled' | 'Incomplete Expired';
  nextBillingCycle: string;
  dateSubscribed: string;
  lastSent: string;
}

interface SortConfig {
  key: keyof Subscription | null;
  direction: 'ascending' | 'descending' | null;
}

// Initial dummy data - empty to match the image
const dummySubscriptions: Subscription[] = [];

export default function Subscription() {
  // const [subscriptions, setSubscriptions] = useState<Subscription[]>(dummySubscriptions);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscription[]>(dummySubscriptions);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: null });
  const [showNewSubscriptionModal, setShowNewSubscriptionModal] = useState<boolean>(false);

  // Select/deselect all rows
  useEffect(() => {
    if (selectAll) {
      setSelectedRows(filteredSubscriptions.map(subscription => subscription.id));
    } else {
      setSelectedRows([]);
    }
  }, [selectAll, filteredSubscriptions]);

  // Handle row selection
  const toggleRowSelection = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Handle column sorting
  const requestSort = (key: keyof Subscription | null) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    // Apply sorting
    const sortedItems = [...filteredSubscriptions].sort((a, b) => {
      if (!key) return 0;
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setFilteredSubscriptions(sortedItems);
  };

  // Subscription status counts
  // const statusCounts = {
  //   'Not Subscribed': 0,
  //   'Active': 0,
  //   'Future': 0,
  //   'Past Due': 0,
  //   'Unpaid': 0,
  //   'Incomplete': 0,
  //   'Canceled': 0,
  //   'Incomplete Expired': 0
  // };

  // Status color mapping
  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'Not Subscribed': 'text-blue-500',
      'Active': 'text-green-500',
      'Future': 'text-lime-500',
      'Past Due': 'text-orange-500',
      'Unpaid': 'text-red-500',
      'Incomplete': 'text-amber-500',
      'Canceled': 'text-gray-400',
      'Incomplete Expired': 'text-teal-500'
    };
    return colorMap[status] || 'text-gray-500';
  };

  const handleAddNewSubscription = (e: React.FormEvent) => {
      e.preventDefault();
      // Implementation would go here
      setShowNewSubscriptionModal(false);
    };

  return (
    <div className="flex-1 dark:bg-black bg-white min-h-screen flex flex-col text-indigo-600 overflow-x-hidden dark:text-gray-100">
      
      {/* Action buttons */}
      <div className="flex justify-between p-6 pb-4">
        <button onClick={() => setShowNewSubscriptionModal(true)} className="flex items-center justify-between text-sm px-4 py-2 cursor-pointer rounded-lg bg-blue-500 text-white hover:bg-blue-600">
          <Plus size={18} className="mr-2" /> New Subscription
        </button>
        <button className="flex items-center justify-center gap-1 py-2 px-4 rounded-lg border border-gray-400 text-gray-500 shadow-sm text-sm dark:text-gray-200 dark:bg-transparent bg-white hover:bg-gray-100 dark:hover:bg-gray-800">
          <Filter size={18} className="mr-2" /> Filters
        </button>
      </div>
      
      {/* Main content area */}
      <div className="mx-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden">
        {/* Stripe Subscriptions Summary */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center">
            <div className="text-xs text-gray-400 font-semibold mr-1 ">stripe</div>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-white">Subscriptions Summary</h2>
          </div>
          
          {/* Status counters row */}
        <div className="flex mt-4 gap-4 justify-start  overflow-x-auto">
          <div className="flex items-center text-start border-r-2 border-gray-400 pr-2 w-full">
            <span className="text-sm font-normal mr-2 text-gray-500 dark:text-white">0</span>
            <span className="text-blue-500 text-sm">Not Subscribed</span>
          </div>
          <div className="flex items-center text-start border-r-2 border-gray-400 pr-4 w-full">
            <span className="text-sm font-normal mr-2 text-gray-500 dark:text-white">0</span>
            <span className="text-green-500 text-sm font-normal">Active</span>
          </div>
          <div className="flex items-center text-start border-r-2 border-gray-400 pr-4 w-full">
            <span className="text-sm font-normal mr-2 text-gray-500 dark:text-white">0</span>
            <span className="text-lime-500 text-sm font-normal">Future</span>
          </div>
          <div className="flex items-center text-start border-r-2 border-gray-400 pr-4 w-full">
            <span className="text-sm font-normal mr-2 text-gray-500 dark:text-white">0</span>
            <span className="text-orange-500 text-sm font-normal">Past Due</span>
          </div>
          <div className="flex items-center text-start border-r-2 border-gray-400 pr-4 w-full">
            <span className="text-sm font-normal mr-2 text-gray-500 dark:text-white">0</span>
            <span className="text-red-500 text-sm font-normal">Unpaid</span>
          </div>
          <div className="flex items-center text-start border-r-2 border-gray-400 pr-4 w-full">
            <span className="text-sm font-normal mr-2 text-gray-500 dark:text-white">0</span>
            <span className="text-amber-500 text-sm font-normal">Incomplete</span>
          </div>
          <div className="flex items-center text-start border-r-2 border-gray-400 pr-4 w-full">
            <span className="text-sm font-normal mr-2 text-gray-500 dark:text-white">0</span>
            <span className="text-gray-400 text-sm font-normal">Canceled</span>
          </div>
          <div className="flex items-start text-start">
            <span className="text-sm font-normal mr-2 text-gray-500 dark:text-white">0</span>
            <span className="text-teal-500 text-sm font-normal">Incomplete<br />Expired</span>
          </div>
        </div>
        </div>
        
        {/* Table controls */}
        <div className="flex justify-between p-4 border-b border-gray-200 dark:border-gray-800 text-sm bg-white dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <select className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
            <button className="px-4 py-1 border cursor-pointer border-gray-400 text-xs rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800">
              Export
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
        <div className="overflow-x-auto bg-white dark:bg-gray-900">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={() => setSelectAll(!selectAll)}
                    className="rounded bg-gray-800 border-gray-600"
                  />
                </th>
                <th className="p-4 text-sm font-medium text-gray-400 cursor-pointer" onClick={() => requestSort('id')}>
                  <div className="flex items-center">
                    # <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-4 text-sm font-medium text-gray-400 cursor-pointer" onClick={() => requestSort('name')}>
                  <div className="flex items-center">
                    Subscription Name <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-4 text-sm font-medium text-gray-400 cursor-pointer" onClick={() => requestSort('customer')}>
                  <div className="flex items-center">
                    Customer <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-4 text-sm font-medium text-gray-400 cursor-pointer" onClick={() => requestSort('project')}>
                  <div className="flex items-center">
                    Project <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-4 text-sm font-medium text-gray-400 cursor-pointer" onClick={() => requestSort('status')}>
                  <div className="flex items-center">
                    Status <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-4 text-sm font-medium text-gray-400 cursor-pointer" onClick={() => requestSort('nextBillingCycle')}>
                  <div className="flex items-center">
                    Next Billing Cycle <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-4 text-sm font-medium text-blue-500 cursor-pointer" onClick={() => requestSort('dateSubscribed')}>
                  <div className="flex items-center">
                    Date Subscribed <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-4 text-sm font-medium text-gray-400 cursor-pointer" onClick={() => requestSort('lastSent')}>
                  <div className="flex items-center">
                    Last Sent <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredSubscriptions.length > 0 ? (
                filteredSubscriptions.map((subscription) => (
                  <tr key={subscription.id} className="border-b border-gray-800 hover:bg-gray-800">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(subscription.id)}
                        onChange={() => toggleRowSelection(subscription.id)}
                        className="rounded bg-gray-800 border-gray-600"
                      />
                    </td>
                    <td className="p-4 text-gray-300">{subscription.id}</td>
                    <td className="p-4 text-gray-300">{subscription.name}</td>
                    <td className="p-4 text-gray-300">{subscription.customer}</td>
                    <td className="p-4 text-gray-300">{subscription.project}</td>
                    <td className="p-4">
                      <span className={getStatusColor(subscription.status)}>{subscription.status}</span>
                    </td>
                    <td className="p-4 text-gray-300">{subscription.nextBillingCycle}</td>
                    <td className="p-4 text-gray-300">{subscription.dateSubscribed}</td>
                    <td className="p-4 text-gray-300">{subscription.lastSent}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-20 h-20 mb-4 text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
                          <path d="M13 8L9 12l4 4" />
                        </svg>
                      </div>
                      <p className="text-lg font-medium text-gray-300">No entries found</p>
                      <div className="mt-4 w-full max-w-md">
                        <div className="h-2 bg-gray-500 rounded mb-2"></div>
                        <div className="h-2 bg-gray-500 rounded mb-2 w-5/6 mx-auto"></div>
                        <div className="h-2 bg-gray-500 rounded w-4/6 mx-auto"></div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    
      {showNewSubscriptionModal &&
      (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800  border border-gray-700 rounded-lg w-full max-w-[38rem] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center bg-blue-400 p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Add New Subscription</h2>
          <button 
            onClick={() => setShowNewSubscriptionModal(false)} 
            className="text-gray-400 hover:text-white"
          >
            <X size={20} color='#fff' />
          </button>
        </div>
        
        <div className="p-6 dark:bg-gray-800 bg-white">
          <div className='bg-yellow-200 w-full text-sm p-4 mb-2'>
            <p className='text-black'>API key not configured, click on the following link to configure API key: <Link href={``} className='text-gray-400'>Stripe Checkout</Link></p>
          </div>
            <div>
              <div className='flex flex-col gap-2 rounded-md dark:bg-white bg-gray-100 border border-gray-200 p-4 my-4'>
              <div className="mb-2">
                <label className="flex mb-1 text-sm text-gray-400">
                 <span className="text-red-500 mr-1">*</span> Billing Plan
                </label>
                <div className="relative">
                  <select className="w-full text-sm dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 dark:text-white text-gray-400 appearance-none">
                    <option>Select Stripe plan</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown size={14} className="text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="mb-2">
                <label className="flex mb-1 text-sm text-gray-400">
                  <span className="text-red-500 mr-1">*</span> Quantity
                </label>
                <input 
                  type="number" 
                  className="w-full text-sm dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 dark:text-white text-gray-400"
                />
              </div>
              <div className="mb-2">
                <label className="flex mb-1 text-sm text-gray-400">
                  <span className="text-gray-400 text-xs mr-1">?</span> First Billing Date
                </label>
                <input 
                    type="date" 
                    required
                    defaultValue="2025-05-14"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  />
              </div>
              </div>
              
              <div className="mb-4">
                <label className="flex mb-1 text-sm text-gray-400">
                  <span className="text-red-500 mr-1">*</span> Subscription Name
                </label>
                <input 
                  type="url" 
                  className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 dark:text-white text-gray-400"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-sm text-gray-400">
                  Description
                </label>
                <textarea 
                  className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 dark:text-white text-gray-400 h-24"
                />
              </div>

              <div className="flex items-center mb-4">
                <input 
                  type="checkbox" 
                  id="descriptionCheckbox"
                  className="mr-2"
                />
                <label htmlFor="descriptionCheckbox" className="text-gray-700 text-xs dark:text-gray-300"><span className='text-gray-400'>?</span> Include description in invoice item
                </label>
              </div>
              
              <div className="mb-4">
                <label className="flex mb-1 text-sm text-gray-400">
                 <span className="text-red-500 mr-1">*</span> Customers
                </label>
                <div className="relative">
                  <select className="w-full dark:bg-gray-700 text-sm bg-white border border-gray-600 rounded p-2 dark:text-white text-gray-500 appearance-none">
                    <option>Select and begin typing</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown size={12} className="text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="flex mb-1 text-sm text-gray-400">
                 <span className="text-red-500 mr-1">*</span> Currency
                </label>
                <div className="relative">
                  <select className="w-full dark:bg-gray-700 text-sm  border border-gray-600 bg-gray-400 rounded p-2 dark:text-white text-gray-50 appearance-none">
                    <option>EUR</option>
                    <option>USD</option>
                    <option>GBP</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown size={12} className="dark:text-gray-400 text-gray-50" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className=" mb-1 text-sm text-gray-400 flex items-center">
                    Tax 1 (Stripe)
                  </label>
                  <div className="relative">
                    <select className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 dark:text-white text-gray-400 appearance-none">
                      <option>No Tax </option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronDown size={12} className="text-gray-400" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block mb-1 text-sm text-gray-400">
                    Tax 2 (Stripe)
                  </label>
                  <div className="relative">
                    <select className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 dark:text-white text-gray-400 appearance-none">
                      <option>No Tax</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronDown size={12} className="text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
              
              
              
              <div className="mb-4">
                <label className="block mb-1 text-sm text-gray-400">
                  Terms and Condition
                </label>
                <textarea
                  placeholder='Enter customer terms and conditions to be displayed to the customer before subscribing'
                  className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 dark:text-white text-gray-400"
                />
              </div>
              
            </div>            
          
          <div className="flex justify-end gap-2 dark:border-t border-gray-700 pt-4 mt-6">
            <button 
              type="button"
              onClick={() => setShowNewSubscriptionModal(false)} 
              className="px-4 py-2 text-white rounded hover:bg-gray-700 bg-gray-600"
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={handleAddNewSubscription}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >Save
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