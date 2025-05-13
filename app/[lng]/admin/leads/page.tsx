'use client'
import { ArrowUpDown, Filter, LayoutGrid, List, Plus, RefreshCw, RotateCw, Search, Tag, X } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import _ from 'lodash'

// Define TypeScript interfaces for our data
interface Lead {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  value: string;
  tags: string[];
  assigned: string;
  status: LeadStatus;
  source: string;
  lastContact: string;
  created: string;
}


// Lead statuses as a union type for better type safety
type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Working' | 'Lost' | 'Clients';

interface SortConfig {
  key: keyof Lead | null;
  direction: 'ascending' | 'descending' | null;
}

const dummyLeads: Lead[] = [
  {
    id: 1,
    name: 'John Smith',
    company: 'Acme Corp',
    email: 'john.smith@acme.com',
    phone: '(555) 123-4567',
    value: '$5,000',
    tags: ['High Priority', 'Tech'],
    assigned: 'Sarah Johnson',
    status: 'New',
    source: 'Website',
    lastContact: '2025-05-10',
    created: '2025-05-01'
  },
  {
    id: 2,
    name: 'Emma Wilson',
    company: 'Globex Inc',
    email: 'emma.w@globex.com',
    phone: '(555) 234-5678',
    value: '$8,500',
    tags: ['Urgent', 'Finance'],
    assigned: 'Mike Chen',
    status: 'Contacted',
    source: 'Referral',
    lastContact: '2025-05-09',
    created: '2025-04-28'
  },
  {
    id: 3,
    name: 'Robert Taylor',
    company: 'Stark Industries',
    email: 'rob.t@stark.com',
    phone: '(555) 345-6789',
    value: '$12,000',
    tags: ['Enterprise', 'Manufacturing'],
    assigned: 'Jessica Lee',
    status: 'Qualified',
    source: 'Trade Show',
    lastContact: '2025-05-11',
    created: '2025-04-25'
  },
  {
    id: 4,
    name: 'Linda Martinez',
    company: 'Wayne Enterprises',
    email: 'linda@wayne.com',
    phone: '(555) 456-7890',
    value: '$7,200',
    tags: ['Mid-tier', 'Retail'],
    assigned: 'David Williams',
    status: 'Working',
    source: 'Email Campaign',
    lastContact: '2025-05-08',
    created: '2025-05-03'
  },
  {
    id: 5,
    name: 'Michael Brown',
    company: 'LexCorp',
    email: 'michael.b@lexcorp.com',
    phone: '(555) 567-8901',
    value: '$9,800',
    tags: ['High Value', 'Energy'],
    assigned: 'Sarah Johnson',
    status: 'Lost',
    source: 'Cold Call',
    lastContact: '2025-05-06',
    created: '2025-04-20'
  },
  {
    id: 6,
    name: 'Jennifer Davis',
    company: 'Oscorp',
    email: 'jennifer@oscorp.com',
    phone: '(555) 678-9012',
    value: '$15,000',
    tags: ['Enterprise', 'Healthcare'],
    assigned: 'Mike Chen',
    status: 'Clients',
    source: 'Partner Referral',
    lastContact: '2025-05-12',
    created: '2025-04-15'
  }
];

export default function Page(): React.ReactElement {
  const [leads, setLeads] = useState<Lead[]>(dummyLeads);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>(dummyLeads);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'All'>('All');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: null });
  const [showNewLeadModal, setShowNewLeadModal] = useState<boolean>(false);

  // Calculate status counts
  const statusCounts = _.countBy(leads, 'status');
  const lostPercentage = leads.length > 0 ? Math.round((statusCounts['Lost'] || 0) / leads.length * 100) : 0;

  // Filter leads when status filter changes
  useEffect(() => {
    if (statusFilter === 'All') {
      setFilteredLeads(leads);
    } else {
      const filtered = leads.filter(lead => lead.status === statusFilter);
      setFilteredLeads(filtered);
    }
  }, [statusFilter, leads]);

  // Select/deselect all rows
  useEffect(() => {
    if (selectAll) {
      setSelectedRows(filteredLeads.map(lead => lead.id));
    } else {
      setSelectedRows([]);
    }
  }, [selectAll, filteredLeads]);

  // Handle row selection
  const toggleRowSelection = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Handle column sorting
  const requestSort = (key: keyof Lead | null) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    // Apply sorting
    const sortedItems = [...filteredLeads].sort((a, b) => {
      if (!key) return 0;
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setFilteredLeads(sortedItems);
  };

  const handleAddNewLead = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation would go here
    setShowNewLeadModal(false);
  };

  // Get sort indicator
  const getSortIndicator = (key: string | null) => {
    if (sortConfig.key !== key) return null;
  };

  // Format status with appropriate color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'text-blue-500';
      case 'Lost':
        return 'text-red-500';
      case 'Clients':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className='flex-1 pb-16 pr-6 flex flex-col text-indigo-600 overflow-x-hidden dark:text-gray-100 gap-2'>
      <h2 className='text-xl font-bold dark:text-gray-100 text-gray-800'>Leads</h2>
      
      {/* Status filter buttons */}
      <div className='flex items-center gap-2 flex-wrap'>
        <div 
          className={`rounded-lg bg-white dark:bg-transparent border dark:border-gray-500 border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 p-2 w-[120px] flex items-center justify-center cursor-pointer ${statusFilter === 'New' ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => setStatusFilter('New')}
        >
          <p className='text-xs dark:text-gray-100 text-gray-500'>{statusCounts['New'] || 0} <span className='ml-1.5 text-blue-500'>New</span></p>
        </div>
        
        <div 
          className={`rounded-lg bg-white dark:bg-transparent border dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 border-gray-400 p-2 w-[120px] flex items-center justify-center cursor-pointer ${statusFilter === 'Contacted' ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => setStatusFilter('Contacted')}
        >
          <p className='text-xs dark:text-gray-100 text-gray-500'>{statusCounts['Contacted'] || 0} <span className='ml-1.5 text-gray-500'>Contacted</span></p>
        </div>
        
        <div 
          className={`rounded-lg bg-white dark:bg-transparent border dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 border-gray-400 p-2 w-[150px] flex items-center justify-center cursor-pointer ${statusFilter === 'Qualified' ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => setStatusFilter('Qualified')}
        >
          <p className='text-xs dark:text-gray-100 text-gray-500'>{statusCounts['Qualified'] || 0} <span className='ml-1.5 text-gray-500'>Qualified</span></p>
        </div>
        
        <div 
          className={`rounded-lg bg-white dark:bg-transparent border dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 border-gray-400 p-2 w-[150px] flex items-center justify-center cursor-pointer ${statusFilter === 'Working' ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => setStatusFilter('Working')}
        >
          <p className='text-xs dark:text-gray-100 text-gray-500'>{statusCounts['Working'] || 0} <span className='ml-1.5 text-gray-500'>Working</span></p>
        </div>
        
        <div 
          className={`rounded-lg bg-white dark:bg-transparent border dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 border-gray-400 p-2 w-[90px] flex items-center justify-center cursor-pointer ${statusFilter === 'Lost' ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => setStatusFilter('Lost')}
        >
          <p className='text-xs dark:text-gray-100 text-gray-500'>{statusCounts['Lost'] || 0} <span className='ml-1.5 text-red-500'>Lost</span></p>
        </div>
        
        <div 
          className={`rounded-lg bg-white dark:bg-transparent border dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 border-gray-400 p-2 w-[90px] flex items-center justify-center cursor-pointer ${statusFilter === 'Clients' ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => setStatusFilter('Clients')}
        >
          <p className='text-xs dark:text-gray-100 text-gray-500'>{statusCounts['Clients'] || 0} <span className='ml-1.5 text-green-500'>Clients</span></p>
        </div>
        
        <div 
          className='rounded-lg bg-white dark:bg-transparent border border-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 p-2 w-[140px] flex items-center justify-center cursor-pointer'
          onClick={() => setStatusFilter('All')}
        >
          <p className='text-xs text-red-400'>{statusCounts['Lost'] || 0} <span className='text-red-400'>Lost Leads - {lostPercentage}%</span></p>
        </div>
      </div>
      
      {/* Action buttons and search */}
      <div className="flex items-center justify-between mt-4 relative">
        <div className='flex gap-2 items-center'>
          <button onClick={() => setShowNewLeadModal(true)} className='flex items-center justify-between text-xs px-3 py-2 cursor-pointer rounded-lg bg-blue-500 text-white hover:bg-blue-600'>
            <Plus size={16} className="mr-1"/> <p>New Lead</p>
          </button>
          
          <div className="flex border border-gray-400 rounded-md overflow-hidden">
            <button className="flex items-center justify-center px-2 py-2 shadow-xs bg-white hover:bg-gray-100 dark:hover:bg-gray-500 dark:hover:text-blue-200 dark:bg-transparent">
              <LayoutGrid size={16} className='dark:text-gray-100 text-gray-500' />
            </button>
          
          </div>
          
          
        </div>
        
        <div className="flex items-center justify-end"> 
          <button  className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg border border-gray-400 text-gray-500 shadow-sm text-xs dark:text-gray-400 dark:bg-transparent bg-white hover:bg-gray-100 dark:hover:bg-gray-500 dark:hover:text-blue-200">
            <Filter size={16} />
            Filters
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 mt-4 overflow-x-auto relative">

      <div className="flex items-center absolute bg-white dark:bg-gray-800 w-full justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-xs">
              <select className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                <option>25</option>
                <option>50</option>
                <option>100</option>
              </select>
              <button className="px-4 py-1 border cursor-pointer border-gray-400 text-xs rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800">
                Export
              </button>
              <button className="px-4 py-1 border cursor-pointer border-gray-400 text-xs rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800">
                Bulk Actions
              </button>
              <button className="p-1 border rounded-md cursor-pointer text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800">
                <RotateCw size={12} />
              </button>
            </div>
            <div className="relative">
              <Search size={12} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
              <input type="text" placeholder="Search..." className="pl-10 pr-4 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-xs bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300" />
            </div>
      </div>

      <div className="overflow-auto w-full">
        {/* Table component */}
        <table className="w-full mt-16">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
              <th className="w-12 px-3 py-1">
                <input 
                  type="checkbox" 
                  className="rounded text-blue-500 focus:ring-blue-500"
                  checked={selectAll}
                  onChange={() => setSelectAll(!selectAll)}
                />
              </th>
              {[
                { key: 'id', label: '#' },
                { key: 'name', label: 'Name' },
                { key: 'company', label: 'Company' },
                { key: 'email', label: 'Email' },
                { key: 'phone', label: 'Phone' },
                { key: 'value', label: 'Value' },
                { key: 'tags', label: 'Tags', noSort: true },
                { key: 'assigned', label: 'Assigned' },
                { key: 'status', label: 'Status' },
                { key: 'source', label: 'Source' },
                { key: 'lastContact', label: 'Last Contact' },
                { key: 'created', label: 'Created' },
              ].map(({ key, label, noSort }) => (
                <th
                  key={key}
                  className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                  onClick={() => !noSort && requestSort(key as any)}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>{label}</span>
                    {getSortIndicator(key)} {!noSort && <ArrowUpDown size={12} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => (
                <tr 
                  key={lead.id} 
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-3 py-2 whitespace-nowrap">
                    <input 
                      type="checkbox" 
                      className="rounded text-blue-500 focus:ring-blue-500"
                      checked={selectedRows.includes(lead.id)}
                      onChange={() => toggleRowSelection(lead.id)}
                    />
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-300">
                    {lead.id}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                    {lead.name}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-300">
                    {lead.company}
                    </td>   
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-300">
                    {lead.email}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-300">
                    {lead.phone}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-300">
                    {lead.value}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-xs">
                    <div className="flex flex-wrap gap-1">
                      {lead.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-300">
                    {lead.assigned}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs">
                    <span className={`${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-300">
                    {lead.source}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-300">
                    {new Date(lead.lastContact).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-300">
                    {new Date(lead.created).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={13} className="px-3 py-16 text-center text-gray-500 dark:text-gray-400">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
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
      
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Showing {filteredLeads.length > 0 ? 1 : 0} to {filteredLeads.length} of {filteredLeads.length} entries
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50">
            Previous
          </button>
          <button className="px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-blue-500 text-white hover:bg-blue-600">
            1
          </button>
          <button className="px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
            Next
          </button>
        </div>
      </div>
      {showNewLeadModal &&(
      <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
        <div className="dark:bg-gray-800 bg-white border border-gray-700 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center bg-blue-400 p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Add New lead</h2>
            <button 
              onClick={() => setShowNewLeadModal(false)} 
              className="text-gray-400 hover:text-white"
            >
              <X size={20} color='#fff' />
            </button>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleAddNewLead}>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block mb-1 text-xs text-gray-400">
                    <span className="text-red-500">*</span> Status
                  </label>
                  <div className="relative">
                    <select className="w-full dark:bg-gray-700 bg-gray-400 border border-gray-600 rounded p-2 text-white">
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
                    <select className="w-full dark:bg-gray-700 bg-gray-400 border border-gray-600 rounded p-2 text-white">
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
                  <select className="w-full dark:bg-gray-700 bg-gray-400 border border-gray-600 rounded p-2 text-white">
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
                  className="w-full dark:bg-gray-700 bg-gray-400 border border-gray-600 rounded p-2 text-white"
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
                    className="w-full dark:bg-gray-700 bg-gray-400 border border-gray-600 rounded p-2 text-white"
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-xs text-gray-400">
                    Address
                  </label>
                  <input 
                    type="text" 
                    className="w-full dark:bg-gray-700 bg-gray-400 border border-gray-600 rounded p-2 text-white"
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
                    className="w-full dark:bg-gray-700 bg-gray-400 border border-gray-600 rounded p-2 text-white"
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-xs text-gray-400">
                    City
                  </label>
                  <input 
                    type="text" 
                    className="w-full dark:bg-gray-700 bg-gray-400 border border-gray-600 rounded p-2 text-white"
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
                    className="w-full dark:bg-gray-700 bg-gray-400 border border-gray-600 rounded p-2 text-white"
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-xs text-gray-400">
                    State
                  </label>
                  <input 
                    type="text" 
                    className="w-full dark:bg-gray-700 bg-gray-400 border border-gray-600 rounded p-2 text-white"
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
                    className="w-full dark:bg-gray-700 bg-gray-400 border border-gray-600 rounded p-2 text-white"
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-xs text-gray-400">
                    Country
                  </label>
                  <div className="relative">
                    <select className="w-full dark:bg-gray-700 bg-gray-400 border border-gray-600 rounded p-2 text-white">
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
                    className="w-full dark:bg-gray-700 bg-gray-400 border border-gray-600 rounded p-2 text-white"
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-xs text-gray-400">
                    Zip Code
                  </label>
                  <input 
                    type="text" 
                    className="w-full dark:bg-gray-700 bg-gray-400 border border-gray-600 rounded p-2 text-white"
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
                      className="w-full dark:bg-gray-700 bg-gray-400 border border-gray-600 rounded p-2 pl-6 text-white"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">$</span>
                  </div>
                </div>
                
                <div>
                  <label className="block mb-1 text-xs text-gray-400">
                    Default Language
                  </label>
                  <div className="relative">
                    <select className="w-full dark:bg-gray-700 bg-gray-400 border border-gray-600 rounded p-2 text-white">
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
                  className="w-full dark:bg-gray-700 bg-gray-400 border border-gray-600 rounded p-2 text-white"
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1 text-xs text-gray-400">
                  Description
                </label>
                <textarea 
                  className="w-full dark:bg-gray-700 bg-gray-400 border border-gray-600 rounded p-2 text-white h-24"
                />
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="publicCheckbox"
                    className="mr-2"
                  />
                  <label htmlFor="publicCheckbox" className="text-gray-300">Public</label>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="contactedToday"
                    className="mr-2"
                    checked
                  />
                  <label htmlFor="contactedToday" className="text-gray-300">Contacted Today</label>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 border-t border-gray-700 pt-4 mt-4">
                <button 
                  type="button"
                  onClick={() => setShowNewLeadModal(false)} 
                  className="px-4 py-2 text-gray-300 rounded hover:bg-gray-700 bg-gray-600"
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