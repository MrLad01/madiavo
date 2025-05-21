'use client';

import {
  Filter,
  Search,
  RotateCw,
  ArrowUpDown,
  Plus,
  Tag,
  X,
  HardDriveUpload,
  FileText,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
// Import recharts components for the charts
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Contract {
  id?: number;
  subject?: string;
  customer?: string;
  contractType?: string;
  status?: 'Active' | 'Expired' | 'About to Expire' | 'Recently Added' |'Trash';
  contractValue?: string;
  startDate?: string;
  endDate?: string;
  project?: string;
  signature?: string;
}

type SortKey = keyof Contract | null;

interface SortConfig {
  key: SortKey;
  direction: 'ascending' | 'descending';
}

interface FilterConfig {
  status?: Contract['status'][];
  project?: Contract['project'][];
  customer?: string[];
}

const dummycontracts: Contract[] = [
  {
    id: 1,
    contractValue: 'contract-001',
    subject: 'Update user dashboard',
    startDate: '2025-05-01',
    endDate: '2025-05-01',
    contractType: 'Svetaines',
    customer: 'Customer A',
    project: 'Project X',
  },
  {
    id: 2,
    contractValue: 'contract-002',
    subject: 'Fix login authentication bug',
    startDate: '2025-05-02',
    endDate: '2025-05-02',
    contractType: 'Dizaino darbai',
    customer: 'Customer B',
    project: 'Project Y',
  },
  {
    id: 3,
    contractValue: 'contract-003',
    subject: 'Implement search functionality',
    startDate: '2025-04-25',
    endDate: '2025-04-25',
    contractType: 'Marketingas',
    customer: 'Customer C',
    project: 'Project Z',
  },
  {
    id: 4,
    contractValue: 'contract-004',
    subject: 'Create onboarding tutorial',
    startDate: '2025-04-28',
    endDate: '2025-04-28',
    contractType: 'Svetaines',
    customer: 'Customer D',
    project: 'Project A',
  },
  {
    id: 5,
    contractValue: 'contract-005',
    subject: 'Optimize database queries',
    startDate: '2025-04-15',
    endDate: '2025-04-15',
    contractType: 'Dizaino darbai',
    customer: 'Customer E',
    project: 'Project B',
  },
];

const statusColors: Record<NonNullable<Contract['status']>, string> = {
  'Active': 'border-blue-500', 
  'Expired': 'border-red-500', 
  'About to Expire': 'border-red-300', 
  'Recently Added': 'border-green-500', 
  'Trash': 'border-gray-500', 
};


const statusTextColors: Record<NonNullable<Contract['status']>, string> = {
  'Active': 'text-blue-500', 
  'Expired': 'text-red-500', 
  'About to Expire': 'text-red-400', 
  'Recently Added': 'text-green-500', 
  'Trash': 'text-gray-500', 
};

// Chart data preparation
const prepareContractTypeData = () => {
  const typeCounts: { [key: string]: number } = {};
  dummycontracts.forEach(contract => {
    if (contract.contractType) {
      typeCounts[contract.contractType] = (typeCounts[contract.contractType] || 0) + 1;
    }
  });
  
  return Object.keys(typeCounts).map(type => ({
    name: type,
    count: typeCounts[type],
  }));
};

const prepareContractValueData = () => {
  // For demonstration, we'll assign a random EUR value to each contract type
  const types = ['Svetaines', 'Dizaino darbai', 'Marketingas'];
  return types.map(type => ({
    name: type,
    value: Math.floor(Math.random() * 10000) / 100, // Random EUR value for demonstration
  }));
};

export default function ContractsPage() {
  const [selectedContracts, setSelectedContracts] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterConfig>({});
  const [activeStatusFilter, setActiveStatusFilter] = useState<Contract['status'] | null>(null);
  const contractsPerPage = 6;
  const [showNewContractModal, setShowNewContractModal] = useState<boolean>(false);
  const [showNewContractTypeModal, setShowNewContractTypeModal] = useState(false);

  // Prepare data for charts
  const contractTypeData = prepareContractTypeData();
  const contractValueData = prepareContractValueData();

  // Unique values for filter dropdowns
  const filterOptions = {
    status: Array.from(new Set(dummycontracts.map(expense => expense.status).filter((s): s is NonNullable<Contract['status']> => s !== undefined))),
    project: Array.from(new Set(dummycontracts.map(expense => expense.project))),
    customer: Array.from(new Set(dummycontracts.map(expense => expense.customer))),
  };

  // Apply filters to contracts
  const filteredcontracts = dummycontracts.filter(expense => {
    // Apply active status filter if set
    if (activeStatusFilter && expense.status !== activeStatusFilter) {
      return false;
    }
    
    return (!filters.status || filters.status.length === 0 || filters.status.includes(expense.status)) &&
           (!filters.project || filters.project.length === 0 || filters.project.includes(expense.project)) &&
           (!filters.customer || filters.customer.length === 0 || filters.customer.includes(expense.customer ?? '')) &&
           (!filters.customer || filters.customer.length === 0 || (expense.customer && Array.isArray(expense.customer) && expense.customer.some(price => filters.customer?.includes(price))));
  });

  const toggleFilter = (filterType: keyof FilterConfig, value: string) => {
    setFilters(prev => {
      const currentFilter = prev[filterType] || [];
      const newFilter = currentFilter.includes(value)
        ? currentFilter.filter(f => f !== value)
        : [...currentFilter, value];
      return { ...prev, [filterType]: newFilter };
    });
  };

  const contractsCounts = {
    'Active': dummycontracts.length,
    'Expired': dummycontracts.filter((t) => t.status === 'Expired').length,
    'About to Expire': dummycontracts.filter((t) => t.status === 'About to Expire').length,
    'Recently Added': dummycontracts.filter((t) => t.status === 'Recently Added').length,
    'Trash': dummycontracts.filter((t) => t.status === 'Trash').length,
  };

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedcontracts = [...filteredcontracts].sort((a, b) => {
    const { key, direction } = sortConfig;
    if (!key) return 0;
    const aValue = a[key] ?? '';
    const bValue = b[key] ?? '';
    if (aValue < bValue) return direction === 'ascending' ? -1 : 1;
    if (aValue > bValue) return direction === 'ascending' ? 1 : -1;
    return 0;
  });

  const indexOfLastexpense = currentPage * contractsPerPage;
  const indexOfFirstexpense = indexOfLastexpense - contractsPerPage;
  const currentcontracts = sortedcontracts.slice(indexOfFirstexpense, indexOfLastexpense);
  const totalPages = Math.ceil(sortedcontracts.length / contractsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedContracts(currentcontracts.map((expense) => expense.id ?? 0));
    } else {
      setSelectedContracts([]);
    }
  };

  const handleSelectexpense = (e: React.ChangeEvent<HTMLInputElement>, expenseId: number | undefined) => {
    if (expenseId === undefined) return;
    if (e.target.checked) {
      setSelectedContracts((prev) => [...prev, expenseId]);
    } else {
      setSelectedContracts((prev) => prev.filter((id) => id !== expenseId));
    }
  };

  const handleStatusFilterChange = (status: Contract['status'] | null) => {
    setActiveStatusFilter(status === activeStatusFilter ? null : status);
  };

  const handleAddNewContract = (e: React.FormEvent) => {
      e.preventDefault();
      // Implementation would go here
      setShowNewContractModal(false);
    };

    const handleAddNewContractType = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle adding new contract type logic here
    setShowNewContractTypeModal(false);
  };

     // Modal for adding new contract type
  const NewContractTypeModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-[50rem] max-h-[100vh] overflow-y-auto">
        <div className="flex justify-between items-center bg-blue-400 p-4">
          <h2 className="text-lg font-semibold text-white">New Contract Type</h2>
          <button 
            onClick={() => setShowNewContractTypeModal(false)} 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} color='#fff' />
          </button>
        </div>
        
        <div className="p-4 dark:bg-gray-800 bg-white">
          <form onSubmit={handleAddNewContractType}>
            <div className="mb-4">
              <label className="block mb-1 text-sm text-gray-400">
                <span className="text-red-500">*</span> Name
              </label>
              <input 
                type="text" 
                required
                className="w-full border border-gray-600 rounded-md p-2 dark:bg-gray-800 bg-white text-gray-400"
              />
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button 
                type="button"
                onClick={() => setShowNewContractTypeModal(false)} 
                className="px-4 py-2 border border-gray-600 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700"
              >
                Close
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  // Filter Dropdown Renderer
  const FilterDropdown = () => (
    <div className="absolute z-10 right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Filters</h3>
      
      {/* Status Filter */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">Status</h4>
        <div className="flex flex-wrap gap-2">
          {filterOptions.status.map(status => (
            <button
              key={status}
              onClick={() => toggleFilter('status', status)}
              className={`px-2 py-1 text-xs rounded-full ${
                filters.status?.includes(status)
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

    </div>
  );

  return (
    <div className="flex-1 p-6 flex flex-col text-indigo-600 dark:text-gray-100 gap-2 dark:bg-gray-900 min-h-screen">
      
      <>
      
      <div>
        <h1 className="text-2xl font-bold dark:text-gray-300 text-gray-700">Contracts</h1>
      </div>

      {/* Status Filter Cards */}
      <div className="flex space-x-4 mt-2">
        {Object.entries(contractsCounts).map(([status, count]) => {
          const statusKey = status as Contract['status'];
          const isActive = activeStatusFilter === statusKey;
          
          return (
            <button
              key={status}
              onClick={() => handleStatusFilterChange(statusKey)}
              className={`flex-1 py-2 px-2 rounded-lg text-left border dark:border-gray-700 border-gray-300 dark:text-gray-200 text-gray-600 ${
                isActive 
                  ? `${statusColors[statusKey ?? 'Active']} text-sm `
                  : 'dark:bg-gray-800 bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex flex-col">
                <p className='text-sm'>
                {count}
                <span className={`font-medium text-sm ml-2 ${statusTextColors[statusKey ?? 'Active']}`}>
                  {status} 
                </span>
                </p>
              </div>
            </button>
          );
        })}
      </div>
      </>

      {/* Filters */}
      <div className="flex items-center justify-between mt-4 relative">
        <div className='flex gap-2 items-center'>
          <button onClick={() => setShowNewContractModal(true)} className='flex items-center justify-between text-xs px-3 py-2 cursor-pointer rounded-lg bg-blue-500 text-white hover:bg-blue-600'>
            <Plus size={16} className="mr-1"/> <p>New Contract</p>
          </button>
          
        </div>
      
        <div className="relative">
          <button 
            onClick={() => setFilterOpen(!filterOpen)} 
            className="flex items-center justify-end gap-2 py-1 rounded-md px-3 dark:bg-gray-800 bg-gray-100 dark:text-gray-100 text-gray-600 border dark:border-gray-400  border-gray-300 dark:hover:bg-gray-700 cursor-pointer "
          >
            <Filter size={14} />
            Filters
          </button>
          {filterOpen && <FilterDropdown />}
        </div>
      </div>

      {/* Charts Section */}
      <div className="flex gap-4 mt-4">
        {/* Contracts by Type Chart */}
        <div className="flex-1 border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
          <h2 className="text-lg font-bold mb-4 dark:text-gray-300 text-gray-700">Contracts by Type</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={contractTypeData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.375rem' }}
                  labelStyle={{ color: '#E5E7EB' }}
                  itemStyle={{ color: '#3B82F6' }}
                />
                <Bar dataKey="count" fill="#3B82F6" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Contracts Value by Type Chart */}
        <div className="flex-1 border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
          <h2 className="text-lg font-bold mb-4 dark:text-gray-300 text-gray-700">Contracts Value by Type ( EUR )</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={contractValueData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.375rem' }}
                  labelStyle={{ color: '#E5E7EB' }}
                  itemStyle={{ color: '#10B981' }}
                  formatter={(value) => [`€${value}`, 'Value']}
                />
                <Line type="monotone" dataKey="value" stroke="#10B981" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* contracts Display */}
      <div className="bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg mt-4 overflow-hidden">
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 px-4">
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

          <div className="relative my-4">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search contracts" 
              className="w-full pl-10 pr-4 py-2 dark:bg-gray-800 bg-gray-50 border dark:border-gray-700 border-gray-300 rounded-lg text-gray-700 dark:text-gray-100 text-xs focus:outline-none"
            />
          </div>
        </div>
        {/* Table */}
        <div className="w-full overflow-x-auto pb-8 bg-white dark:bg-gray-800">
          <table className="w-full">
            <thead className=" dark:border-b border-gray-700 dark:bg-gray-900 bg-gray-200 text-sm ">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" onChange={handleSelectAll} checked={selectedContracts.length === currentcontracts.length} className="rounded bg-gray-700" />
                </th>
                {['#', 'subject', 'customer' , 'contract type', 'contract value', 'start date', 'end date', 'project', 'signature'].map((key) => (
                  <th key={key} className="px-4 py-3 text-left text-xs font-medium dark:text-gray-100 text-gray-600 cursor-pointer" onClick={() => requestSort(key as SortKey)}>
                    <div className="flex items-center gap-1.5 capitalize">
                      {key}
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentcontracts.length > 0 ? (
                currentcontracts.map((expense) => (
                  <tr key={expense.id} className="border-b dark:border-gray-700 border-gray-200 dark:hover:bg-gray-700 hover:bg-gray-100 dark:bg-gray-800 bg-white ">
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={expense.id ? selectedContracts.includes(expense.id) : false} onChange={(e) => expense.id && handleSelectexpense(e, expense.id)} className="rounded bg-gray-700" />
                    </td>
                    <td className="px-4 py-3 text-xs dark:text-gray-100 text-gray-600">{expense.id}</td>
                    <td className="px-4 py-3 text-xs font-normal dark:text-gray-100 text-gray-600">{expense.subject}</td>
                    <td className="px-4 py-3 text-xs font-normal dark:text-gray-100 text-gray-600">{expense.customer}</td>
                    <td className="px-4 py-3 text-xs dark:text-gray-100 text-gray-600">{expense.contractType}</td>
                    <td className="px-4 py-3 text-xs dark:text-gray-100 text-gray-600">{expense.contractValue}</td>
                    <td className="px-4 py-3 text-xs dark:text-gray-100 text-gray-600">{expense.startDate}</td>
                    <td className="px-4 py-3 text-xs dark:text-gray-100 text-gray-600">{expense.endDate}</td>
                    <td className="px-4 py-3 text-xs dark:text-gray-100 text-gray-600">{expense.project}</td>
                    <td className="px-4 py-3 text-xs dark:text-gray-100 text-gray-600">{expense.signature}</td>
                  </tr>
                ))
              ) : (
                <tr className="bg-white dark:bg-gray-800">
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <svg className="w-10 h-10 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                      <p>No contracts Found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {currentcontracts.length > 0 && (
          <div className="flex justify-between items-center p-4 dark:border-t border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-400">
            <span className="text-gray-400">Page {currentPage} of {totalPages}</span>
            <div className="flex gap-2">
              <button onClick={handlePreviousPage} disabled={currentPage === 1} className={`px-3 py-1 rounded ${currentPage === 1 ? 'dark:bg-gray-700 bg-gray-100 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700'}`}>
                Previous
              </button>
              <button onClick={handleNextPage} disabled={currentPage === totalPages} className={`px-3 py-1 rounded ${currentPage === totalPages ? 'dark:bg-gray-700 bg-gray-100 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700'}`}>
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    
      
    
      {showNewContractModal &&(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="dark:bg-gray-900 bg-white rounded-lg w-full max-w-[50rem] max-h-[90vh] overflow-y-auto mt-4 text-sm ">
            <div className="p-6">
              <div className="flex justify-between items-center p-2">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">Contract Information</h2>
              <button 
                onClick={() => setShowNewContractModal(false)} 
                className="text-gray-700 hover:text-gray-700 dark:text-white dark:hover:text-gray-200 -mt-4"
              >
              <X size={20} />
              </button>
              </div>
              
              <form onSubmit={handleAddNewContract}>
                <div className="flex space-x-6 mb-6">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="trashCheckbox"
                      className="mr-2 h-4 w-4 bg-gray-700 border-gray-600"
                    />
                    <label htmlFor="trashCheckbox" className="text-gray-400 text-sm">Trash</label>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="hideFromCustomerCheckbox"
                      className="mr-2 h-4 w-4 bg-gray-700 border-gray-600"
                    />
                    <label htmlFor="hideFromCustomerCheckbox" className="text-gray-400 text-sm">Hide from customer</label>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block mb-2 text-sm text-gray-400">
                    <span className="text-red-500">*</span> Customer
                  </label>
                  <div className="relative">
                    <select className="w-full border border-gray-600 rounded-md p-2 dark:bg-gray-800 bg-white text-gray-300 appearance-none">
                      <option>Select and begin typing</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block mb-2 text-sm text-gray-400">
                    <span className="text-red-500">*</span> Subject
                  </label>
                  <input 
                    type="text" 
                    required
                    className="w-full border border-gray-600 rounded-md p-2 dark:bg-gray-800 bg-white text-gray-300"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block mb-2 text-sm text-gray-400">
                    Contract Value
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      className="w-full border border-gray-600 rounded-md p-2 dark:bg-gray-800 bg-white text-gray-400"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-400">€</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block mb-2 text-sm text-gray-400">
                    Contract type
                  </label>
                  <div className="flex">
                    <div className="relative flex-grow">
                      <select className="w-full border border-gray-600 rounded-l-md p-2 dark:bg-gray-800 bg-white text-gray-300 appearance-none">
                        <option>n</option>
                        <option>Option 1</option>
                        <option>Option 2</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setShowNewContractTypeModal(true)}
                      className="px-3 py-1 dark:bg-gray-800 bg-white border border-gray-600 border-l-0 rounded-r-md text-gray-400 hover:bg-gray-700"
                    >
                      <span className="text-xl">+</span>
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block mb-2 text-sm text-gray-400">
                      <span className="text-red-500">*</span> Start Date
                    </label>
                    <div className="relative">
                      <input 
                        type="date" 
                        required
                        defaultValue="2025-05-21"
                        className="w-full border border-gray-600 rounded-md p-2 dark:bg-gray-800 bg-white text-gray-400"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-2 text-sm text-gray-400">
                      End Date
                    </label>
                    <div className="relative">
                      <input 
                        type="date" 
                        className="w-full border border-gray-600 rounded-md p-2 dark:bg-gray-800 bg-white text-gray-300"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block mb-2 text-sm text-gray-400">
                    Description
                  </label>
                  <textarea 
                    className="w-full border border-gray-600 rounded-md p-2 dark:bg-gray-800 bg-white text-gray-400 h-32"
                  />
                </div>
                
                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
      {showNewContractTypeModal && <NewContractTypeModal />}
        </div>
      
    )
  }
    </div>
    
  );
}