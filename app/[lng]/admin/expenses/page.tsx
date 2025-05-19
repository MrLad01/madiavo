'use client';

import {
  ArrowRight,
  Filter,
  Search,
  RotateCw,
  ArrowUpDown,
  LayoutGrid,
  List,
  User,
  Plus,
  Tag,
  X,
  HardDriveUpload,
  FileText,
} from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

interface Expense {
  id: string;
  category?: string;
  amount?: string;
  name: string;
  receipt?: string;
  status?: 'Total' | 'Billable' | 'Non Billable' | 'Not Invoiced' |'Billed';
  date?: string;
  project?: string;
  customer?: string;
  invoice?: string;
  reference?: string;
  payment?: string;
}

type SortKey = keyof Expense | null;

interface SortConfig {
  key: SortKey;
  direction: 'ascending' | 'descending';
}

interface FilterConfig {
  status?: Expense['status'][];
  project?: Expense['project'][];
  customer?: string[];
  amount?: string[];
}

const dummyExpenses: Expense[] = [
  {
    id: 'expense-001',
    name: 'Update user dashboard',
    date: '2025-05-01',
    receipt: '2025-05-15',
    customer: 'Alex Johnson',
  },
  {
    id: 'expense-002',
    name: 'Fix login authentication bug',
    date: '2025-05-02',
    receipt: '2025-05-10',
    customer: 'Samantha Lee'
  },
  {
    id: 'expense-003',
    name: 'Implement search functionality',
    date: '2025-04-25',
    receipt: '2025-05-08',
    customer: 'Michael Chen'
  },
  {
    id: 'expense-004',
    name: 'Create onboarding tutorial',
    date: '2025-04-28',
    receipt: '2025-05-20',
    customer: 'Emma Wilson'
  },
  {
    id: 'expense-005',
    name: 'Optimize database queries',
    date: '2025-04-15',
    receipt: '2025-04-30',
    customer: 'David Kim'
  },
];

const statusColors: Record<NonNullable<Expense['status']>, string> = {
  'Total': 'border-green-500', 
  'Billable': 'border-green-500', 
  'Non Billable': 'border-green-500', 
  'Not Invoiced': 'border-green-500', 
  'Billed': 'border-green-500', 
};

const statusColorsi: Record<NonNullable<Expense['status']>, string> = {
  'Total': 'bg-green-500', 
  'Billable': 'bg-green-500', 
  'Non Billable': 'bg-green-500', 
  'Not Invoiced': 'bg-green-500', 
  'Billed': 'bg-green-500', 
};


const statusTextColors: Record<NonNullable<Expense['status']>, string> = {
  'Total': 'text-green-500', 
  'Billable': 'text-green-500', 
  'Non Billable': 'text-green-500', 
  'Not Invoiced': 'text-green-500', 
  'Billed': 'text-green-500', 
};

export default function ExpensesPage() {
  const [selectedexpenses, setSelectedexpenses] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterConfig>({});
  const [activeStatusFilter, setActiveStatusFilter] = useState<Expense['status'] | null>(null);
  const expensesPerPage = 6;
  const [showNewExpenseModal, setShowNewExpenseModal] = useState<boolean>(false);

  // Unique values for filter dropdowns
  const filterOptions = {
    status: Array.from(new Set(dummyExpenses.map(expense => expense.status).filter((s): s is NonNullable<Expense['status']> => s !== undefined))),
    project: Array.from(new Set(dummyExpenses.map(expense => expense.project))),
    customer: Array.from(new Set(dummyExpenses.map(expense => expense.customer))),
    amount: Array.from(new Set(dummyExpenses.flatMap(expense => expense.amount))),
  };

  // Apply filters to expenses
  const filteredExpenses = dummyExpenses.filter(expense => {
    // Apply active status filter if set
    if (activeStatusFilter && expense.status !== activeStatusFilter) {
      return false;
    }
    
    return (!filters.status || filters.status.length === 0 || filters.status.includes(expense.status)) &&
           (!filters.project || filters.project.length === 0 || filters.project.includes(expense.project)) &&
           (!filters.customer || filters.customer.length === 0 || filters.customer.includes(expense.customer ?? '')) &&
           (!filters.amount || filters.amount.length === 0 || (expense.amount && Array.isArray(expense.amount) && expense.amount.some(price => filters.amount?.includes(price))));
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

  const expensesCounts = {
    'Total': dummyExpenses.length,
    'Billable': dummyExpenses.filter((t) => t.status === 'Billable').length,
    'Non Billable': dummyExpenses.filter((t) => t.status === 'Non Billable').length,
    'Not Invoiced': dummyExpenses.filter((t) => t.status === 'Not Invoiced').length,
    'Billed': dummyExpenses.filter((t) => t.status === 'Billed').length,
  };

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedexpenses = [...filteredExpenses].sort((a, b) => {
    const { key, direction } = sortConfig;
    if (!key) return 0;
    const aValue = a[key] ?? '';
    const bValue = b[key] ?? '';
    if (aValue < bValue) return direction === 'ascending' ? -1 : 1;
    if (aValue > bValue) return direction === 'ascending' ? 1 : -1;
    return 0;
  });

  const indexOfLastexpense = currentPage * expensesPerPage;
  const indexOfFirstexpense = indexOfLastexpense - expensesPerPage;
  const currentExpenses = sortedexpenses.slice(indexOfFirstexpense, indexOfLastexpense);
  const totalPages = Math.ceil(sortedexpenses.length / expensesPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedexpenses(currentExpenses.map((expense) => expense.id));
    } else {
      setSelectedexpenses([]);
    }
  };

  const handleSelectexpense = (e: React.ChangeEvent<HTMLInputElement>, expenseId: string) => {
    if (e.target.checked) {
      setSelectedexpenses((prev) => [...prev, expenseId]);
    } else {
      setSelectedexpenses((prev) => prev.filter((id) => id !== expenseId));
    }
  };

  const handleStatusFilterChange = (status: Expense['status'] | null) => {
    setActiveStatusFilter(status === activeStatusFilter ? null : status);
  };

  const handleAddNewexpense = (e: React.FormEvent) => {
      e.preventDefault();
      // Implementation would go here
      setShowNewExpenseModal(false);
    };

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
    <div className="flex-1 p-6 flex flex-col text-indigo-600 dark:text-gray-100  gap-2 dark:bg-gray-900 min-h-screen">
      
      <>
      
      <div>
        <h1 className="text-2xl font-bold dark:text-gray-300 text-gray-700">Expenses</h1>
      </div>

      {/* Status Filter Cards */}
      <div className="flex space-x-4 mt-2">
        {Object.entries(expensesCounts).map(([status, count]) => {
          const statusKey = status as Expense['status'];
          const isActive = activeStatusFilter === statusKey;
          
          return (
            <button
              key={status}
              onClick={() => handleStatusFilterChange(statusKey)}
              className={`flex-1 py-2 px-2 rounded-lg text-left border dark:border-gray-700 border-gray-300 dark:text-gray-200 text-gray-600 ${
                isActive 
                  ? `${statusColors[statusKey ?? 'Total']} text-sm `
                  : 'dark:bg-gray-800 bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex flex-col">
                <p className='text-sm'>
                {/* {count} */}
                <span className={`font-medium text-sm ${statusTextColors[statusKey ?? 'Total']}`}>
                   {status} 
                </span>
                </p>
                <p className={`text-sm `}>€ 0.00 </p>
              </div>
            </button>
          );
        })}
      </div>
      </>

      {/* Filters */}
      <div className="flex items-center justify-between mt-4 relative">
        <div className='flex gap-2 items-center'>
          <button onClick={() => setShowNewExpenseModal(true)} className='flex items-center justify-between text-xs px-3 py-2 cursor-pointer rounded-lg bg-blue-500 text-white hover:bg-blue-600'>
            <Plus size={16} className="mr-1"/> <p>Record Expense</p>
          </button>
          <button className='flex items-center justify-between text-xs px-3 py-2 cursor-pointer rounded-lg bg-transparent border text-gray-600 dark:text-gray-300 hover:bg-blue-300'>
            <HardDriveUpload size={14} className="mr-1"/> <p>Import Expenses</p>
          </button>
          <button title='Bulk PDF Export' className='flex items-center justify-between text-xs px-3 py-2 cursor-pointer rounded-lg bg-transparent border text-gray-600 dark:text-gray-300 hover:bg-blue-300'>
            <FileText size={14} className="mr-1"/>
          </button>
        </div>
      
        <div className="relative">
          <button 
            onClick={() => setFilterOpen(!filterOpen)} 
            className="flex items-center justify-end gap-2 py-2 rounded-md px-3 dark:bg-gray-800 bg-gray-100 dark:text-gray-100 text-gray-600 border dark:border-gray-400  border-gray-300 dark:hover:bg-gray-700 cursor-pointer "
          >
            <Filter size={16} />
            Filters
          </button>
          {filterOpen && <FilterDropdown />}
        </div>
      </div>



      {/* expenses Display */}
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
              placeholder="Search expenses" 
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
                  <input type="checkbox" onChange={handleSelectAll} checked={selectedexpenses.length === currentExpenses.length} className="rounded bg-gray-700" />
                </th>
                {['category', 'amount' , 'name', 'receipt', 'date', 'project', 'customer', 'invoice', 'reference #' , 'payment Mode'].map((key) => (
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
              {currentExpenses.length > 0 ? (
                currentExpenses.map((expense) => (
                  <tr key={expense.id} className="border-b dark:border-gray-700 border-gray-200 dark:hover:bg-gray-700 hover:bg-gray-100 dark:bg-gray-800 bg-white ">
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selectedexpenses.includes(expense.id)} onChange={(e) => handleSelectexpense(e, expense.id)} className="rounded bg-gray-700" />
                    </td>
                    <td className="px-4 py-3 text-xs dark:text-gray-100 text-gray-600">{expense.id}</td>
                    <td className="px-4 py-3 text-xs font-normal dark:text-gray-100 text-gray-600">{expense.amount}</td>
                    <td className="px-4 py-3 text-xs font-normal dark:text-gray-100 text-gray-600">{expense.name}</td>
                    <td className="px-4 py-3 text-xs dark:text-gray-100 text-gray-600">{expense.receipt}</td>
                    <td className="px-4 py-3 text-xs dark:text-gray-100 text-gray-600">{expense.date}</td>
                    <td className="px-4 py-3 text-xs dark:text-gray-100 text-gray-600">{expense.project}</td>
                    <td className="px-4 py-3 text-xs dark:text-gray-100 text-gray-600">{expense.customer}</td>
                    <td className="px-4 py-3 text-xs dark:text-gray-100 text-gray-600">{expense.invoice}</td>
                    <td className="px-4 py-3 text-xs dark:text-gray-100 text-gray-600">{expense.reference}</td>
                    <td className="px-4 py-3 text-xs dark:text-gray-100 text-gray-600">{expense.payment}</td>
                  </tr>
                ))
              ) : (
                <tr className="bg-white dark:bg-gray-800">
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <svg className="w-10 h-10 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                      <p>No Expenses Found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {currentExpenses.length > 0 && (
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
      
    
      {showNewExpenseModal &&(
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center bg-blue-400 p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Add New expense</h2>
          <button 
            onClick={() => setShowNewExpenseModal(false)} 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} color='#fff' />
          </button>
        </div>
        
        <div className="p-4">
          <form onSubmit={handleAddNewexpense}>
            <div className="flex space-x-4 mb-4">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="publicCheckbox"
                  className="mr-2"
                />
                <label htmlFor="publicCheckbox" className="text-gray-700 dark:text-gray-300">Public</label>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="billableCheckbox"
                  className="mr-2"
                  checked
                />
                <label htmlFor="billableCheckbox" className="text-gray-700 dark:text-gray-300">Billable</label>
              </div>
              
            </div>
            
            <div className="mb-4">
              <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
                <span className="text-red-500">*</span> Subject
              </label>
              <input 
                type="text" 
                required
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
                Hourly Rate
              </label>
              <input 
                type="number" 
                placeholder="0"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
                  <span className="text-red-500">*</span> Start Date
                </label>
                <div className="flex">
                  <input 
                    type="date" 
                    required
                    defaultValue="2025-05-14"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
                  Due Date
                </label>
                <div className="flex">
                  <input 
                    type="date" 
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
                  project
                </label>
                <select className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                  <option>Medium</option>
                  <option>High</option>
                  <option>Low</option>
                  <option>Critical</option>
                </select>
              </div>
              
              <div>
                <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
                  Repeat every
                </label>
                <select className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                  <option>Nothing selected</option>
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
                Related To
              </label>
              <select className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                <option>Nothing selected</option>
                <option>Project A</option>
                <option>Client B</option>
                <option>expense C</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
                  Assignees
                </label>
                <select className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                  <option>Rodolfo Baumbach</option>
                  <option>Sarah Johnson</option>
                  <option>Mike Chen</option>
                </select>
              </div>
              
              <div>
                <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
                  Followers
                </label>
                <select className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                  <option>Nothing selected</option>
                  <option>Team A</option>
                  <option>Department B</option>
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <label className=" mb-1 text-sm text-gray-700 dark:text-gray-300 flex items-center">
                <Tag size={16} className="mr-1" />
                Tags
              </label>
              <input 
                type="text" 
                placeholder="Tag"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
                Expense Description
              </label>
              <textarea 
                placeholder="Add Description"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white h-24"
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-4 dark:border-t dark:border-gray-700">
              <button 
                type="button"
                onClick={() => setShowNewExpenseModal(false)} 
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
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
    )
  }
    </div>
    
  );
}