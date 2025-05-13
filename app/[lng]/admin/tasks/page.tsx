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
} from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

interface Task {
  id: string;
  name: string;
  status: 'Not Started' | 'In Progress' | 'Testing' | 'Awaiting Feedback' | 'Complete';
  startDate: string;
  dueDate: string;
  assignedTo: string;
  tags: string[];
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
}

type SortKey = keyof Task | null;

interface SortConfig {
  key: SortKey;
  direction: 'ascending' | 'descending';
}

interface FilterConfig {
  status?: Task['status'][];
  priority?: Task['priority'][];
  assignedTo?: string[];
  tags?: string[];
}

const dummyTasks: Task[] = [
  {
    id: 'TASK-001',
    name: 'Update user dashboard',
    status: 'Not Started',
    startDate: '2025-05-01',
    dueDate: '2025-05-15',
    assignedTo: 'Alex Johnson',
    tags: ['Frontend', 'UI'],
    priority: 'High',
  },
  {
    id: 'TASK-002',
    name: 'Fix login authentication bug',
    status: 'In Progress',
    startDate: '2025-05-02',
    dueDate: '2025-05-10',
    assignedTo: 'Samantha Lee',
    tags: ['Backend', 'Security'],
    priority: 'Critical',
  },
  {
    id: 'TASK-003',
    name: 'Implement search functionality',
    status: 'Testing',
    startDate: '2025-04-25',
    dueDate: '2025-05-08',
    assignedTo: 'Michael Chen',
    tags: ['Backend', 'API'],
    priority: 'Medium',
  },
  {
    id: 'TASK-004',
    name: 'Create onboarding tutorial',
    status: 'Awaiting Feedback',
    startDate: '2025-04-28',
    dueDate: '2025-05-20',
    assignedTo: 'Emma Wilson',
    tags: ['Documentation', 'UX'],
    priority: 'Low',
  },
  {
    id: 'TASK-005',
    name: 'Optimize database queries',
    status: 'Complete',
    startDate: '2025-04-15',
    dueDate: '2025-04-30',
    assignedTo: 'David Kim',
    tags: ['Backend', 'Database'],
    priority: 'High',
  },
];

const statusColors: Record<Task['status'], string> = {
  'Not Started': 'border-yellow-400',
  'In Progress': 'border-purple-500',
  'Testing': 'border-indigo-500',
  'Awaiting Feedback': 'border-green-400',
  'Complete': 'border-green-500',
};

const statusColorsi: Record<Task['status'], string> = {
  'Not Started': 'bg-yellow-400',
  'In Progress': 'bg-purple-500',
  'Testing': 'bg-indigo-500',
  'Awaiting Feedback': 'bg-green-400',
  'Complete': 'bg-green-500',
};


const statusTextColors: Record<Task['status'], string> = {
  'Not Started': 'text-yellow-400',
  'In Progress': 'text-purple-500',
  'Testing': 'text-blue-400',
  'Awaiting Feedback': 'text-green-400',
  'Complete': 'text-green-500',
};

const priorityColors: Record<Task['priority'], string> = {
  Critical: 'text-red-500',
  High: 'text-orange-500',
  Medium: 'text-yellow-500',
  Low: 'text-blue-500',
};

export default function TaskPage() {
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterConfig>({});
  const [activeStatusFilter, setActiveStatusFilter] = useState<Task['status'] | null>(null);
  const tasksPerPage = 6;

  // Unique values for filter dropdowns
  const filterOptions = {
    status: Array.from(new Set(dummyTasks.map(task => task.status))),
    priority: Array.from(new Set(dummyTasks.map(task => task.priority))),
    assignedTo: Array.from(new Set(dummyTasks.map(task => task.assignedTo))),
    tags: Array.from(new Set(dummyTasks.flatMap(task => task.tags))),
  };

  // Apply filters to tasks
  const filteredTasks = dummyTasks.filter(task => {
    // Apply active status filter if set
    if (activeStatusFilter && task.status !== activeStatusFilter) {
      return false;
    }
    
    return (!filters.status || filters.status.length === 0 || filters.status.includes(task.status)) &&
           (!filters.priority || filters.priority.length === 0 || filters.priority.includes(task.priority)) &&
           (!filters.assignedTo || filters.assignedTo.length === 0 || filters.assignedTo.includes(task.assignedTo)) &&
           (!filters.tags || filters.tags.length === 0 || task.tags.some(tag => filters.tags?.includes(tag)));
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

  const taskCounts = {
    'Not Started': dummyTasks.filter((t) => t.status === 'Not Started').length,
    'In Progress': dummyTasks.filter((t) => t.status === 'In Progress').length,
    'Testing': dummyTasks.filter((t) => t.status === 'Testing').length,
    'Awaiting Feedback': dummyTasks.filter((t) => t.status === 'Awaiting Feedback').length,
    'Complete': dummyTasks.filter((t) => t.status === 'Complete').length,
  };

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const { key, direction } = sortConfig;
    if (!key) return 0;
    const aValue = a[key];
    const bValue = b[key];
    if (aValue < bValue) return direction === 'ascending' ? -1 : 1;
    if (aValue > bValue) return direction === 'ascending' ? 1 : -1;
    return 0;
  });

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = sortedTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(sortedTasks.length / tasksPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedTasks(currentTasks.map((task) => task.id));
    } else {
      setSelectedTasks([]);
    }
  };

  const handleSelectTask = (e: React.ChangeEvent<HTMLInputElement>, taskId: string) => {
    if (e.target.checked) {
      setSelectedTasks((prev) => [...prev, taskId]);
    } else {
      setSelectedTasks((prev) => prev.filter((id) => id !== taskId));
    }
  };

  const handleStatusFilterChange = (status: Task['status'] | null) => {
    setActiveStatusFilter(status === activeStatusFilter ? null : status);
  };

  // Remove GridView as we no longer need it

  // Kanban Board View
  const KanbanView = () => {
    const statusList: Task['status'][] = ['Not Started', 'In Progress', 'Testing', 'Awaiting Feedback', 'Complete'];
    
    return (
      <div className="flex gap-2 pb-16 overflow-x-auto">
        {statusList.map(status => {
          const statusTasks = dummyTasks.filter(task => task.status === status);
          
          return (
            <div key={status} className="flex flex-col h-full min-w-[20rem]">
              <div className={`px-2 py-2 text-white font-medium text-sm rounded-t-lg ${statusColorsi[status]}`}>
                {status} - {statusTasks.length} Tasks
              </div>
              
              <div className="dark:bg-gray-900 bg-gray-100 flex-1 rounded-b-lg p-4 min-h-96">
                {statusTasks.length > 0 ? (
                  <div className="space-y-3">
                    {statusTasks.map(task => (
                      <div key={task.id} className="dark:bg-gray-800 bg-white rounded-lg p-3 shadow-sm border dark:border-gray-700 border-gray-100">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-normal dark:text-gray-400 text-gray-700">{task.id}</span>
                          <span className={`text-xs font-semibold ${priorityColors[task.priority]}`}>
                            {task.priority}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold mb-2 dark:text-gray-200">
                          {task.name}
                        </h3>
                        <div className='rounded-2xl w-fit bg-gray-100 dark:bg-gray-400 p-2'>
                          <User size={18} className='dark:text-gray-300 text-gray-600' />
                        </div>
                        <div className="flex gap-1 mt-2">
                          {task.tags.map((tag, idx) => (
                            <span 
                              key={idx} 
                              className="px-2 py-0.5 text-xs rounded-full dark:bg-gray-700 bg-gray-100 text-gray-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className='flex justify-end items-end'>
                          <p className='text-sm text-gray-400'>{task.dueDate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="text-gray-500 mb-2">
                      <svg className="w-8 h-8 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-center">No Tasks Found</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Filter Dropdown Renderer
  const FilterDropdown = () => (
    <div className="absolute z-10 right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg p-4">
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

      {/* Priority Filter */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">Priority</h4>
        <div className="flex flex-wrap gap-2">
          {filterOptions.priority.map(priority => (
            <button
              key={priority}
              onClick={() => toggleFilter('priority', priority)}
              className={`px-2 py-1 text-xs rounded-full ${
                filters.priority?.includes(priority)
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {priority}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 p-6 flex flex-col text-indigo-600 dark:text-gray-100 bg-white gap-2 dark:bg-black min-h-screen">
      {viewMode !== 'kanban' &&
      <>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold dark:text-gray-300 text-gray-600">Tasks</h1>
        <Link href="/" className="flex items-center gap-2 py-1">
          <p className="text-sm dark:text-gray-300 text-gray-600">Tasks Overview</p>
          <ArrowRight size={16} className='dark:text-gray-300 text-gray-600' />
        </Link>
      </div>

      {/* Status Filter Cards */}
      <div className="flex space-x-4 mt-2">
        {Object.entries(taskCounts).map(([status, count]) => {
          const statusKey = status as Task['status'];
          const isActive = activeStatusFilter === statusKey;
          
          return (
            <button
              key={status}
              onClick={() => handleStatusFilterChange(statusKey)}
              className={`flex-1 py-2 px-2 rounded-lg text-left border border-gray-700 dark:text-gray-200 text-gray-600 ${
                isActive 
                  ? `${statusColors[statusKey]} text-sm `
                  : 'dark:bg-gray-800 bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex flex-col">
                <p className='text-sm'>
                {count}
                <span className={`font-medium ml-1.5 text-sm ${statusTextColors[statusKey]}`}>
                   {status} 
                </span>
                </p>
                <p className={`text-sm `}>My Tasks: {count} </p>
              </div>
            </button>
          );
        })}
      </div>
      </>}

      {/* Filters */}
      <div className="flex items-center justify-between mt-4 relative">
        <button 
          onClick={() => setViewMode(viewMode === 'kanban' ? 'list' : 'kanban')} 
          className="flex items-center justify-center gap-2 rounded-md px-3 py-2 border dark:bg-gray-800 bg-gray-100 border-gray-400 dark:hover:bg-gray-700"
        >
          {viewMode === 'kanban' ? (
              <List size={16} className='dark:text-gray-100 text-gray-700' />
          ) : (
            <LayoutGrid size={16} className='dark:text-gray-100 text-gray-700' />
          )}
        </button>
        {viewMode === 'kanban' &&
        <div className="relative mt-2 mb-4">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-100" />
              <input 
                type="text" 
                placeholder="Search Tasks" 
                className="w-full pl-10 pr-4 py-2 border dark:bg-gray-800 bg-gray-50  border-gray-700 rounded-lg text-gray-700 dark:text-gray-100 focus:outline-none"
              />
            </div>
        }
        
        {viewMode !== 'kanban' &&
        <div className="relative">
          <button 
            onClick={() => setFilterOpen(!filterOpen)} 
            className="flex items-center justify-end gap-2 py-2 rounded-md px-3 dark:bg-gray-800 bg-gray-100 dark:text-gray-100 text-gray-600 border border-gray-400  dark:hover:bg-gray-700 "
          >
            <Filter size={16} />
            Filters
          </button>
          {filterOpen && <FilterDropdown />}
        </div>}
      </div>

      {/* Search Bar */}
      {viewMode !== 'kanban' &&
      <div className="relative mt-2 mb-4">
        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <input 
          type="text" 
          placeholder="Search Tasks" 
          className="w-full pl-10 pr-4 py-2 dark:bg-gray-800 bg-gray-50 border border-gray-700 rounded-lg text-gray-700 dark:text-gray-100  focus:outline-none"
        />
      </div>}

      {/* Tasks Display */}
      {viewMode === 'list' && (
        <div className="bg-gray-800 rounded-lg mt-4 overflow-hidden">
          {/* Table */}
          <table className="w-full">
            <thead className=" dark:border-b border-gray-700 dark:bg-gray-900 bg-gray-200 text-sm ">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" onChange={handleSelectAll} checked={selectedTasks.length === currentTasks.length} className="rounded bg-gray-700" />
                </th>
                {['#', 'name', 'status', 'startDate', 'dueDate', 'assignedTo', 'tags', 'priority'].map((key) => (
                  <th key={key} className="px-4 py-3 text-left text-sm font-medium dark:text-gray-100 text-gray-600 cursor-pointer" onClick={() => requestSort(key as SortKey)}>
                    <div className="flex items-center gap-1 capitalize">
                      {key}
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentTasks.length > 0 ? (
                currentTasks.map((task) => (
                  <tr key={task.id} className="border-b dark:border-gray-700 border-gray-200 dark:hover:bg-gray-700 hover:bg-gray-100 dark:bg-gray-800 bg-white ">
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selectedTasks.includes(task.id)} onChange={(e) => handleSelectTask(e, task.id)} className="rounded bg-gray-700" />
                    </td>
                    <td className="px-4 py-3 text-sm dark:text-gray-100 text-gray-600">{task.id}</td>
                    <td className="px-4 py-3 text-sm font-normal dark:text-gray-100 text-gray-600">{task.name}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-normal ${statusTextColors[task.status]}`}>{task.status}</span>
                    </td>
                    <td className="px-4 py-3 text-sm dark:text-gray-100 text-gray-600">{task.startDate}</td>
                    <td className="px-4 py-3 text-sm dark:text-gray-100 text-gray-600">{task.dueDate}</td>
                    <td className="px-4 py-3 text-sm dark:text-gray-100 text-gray-600">{task.assignedTo}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {task.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-0.5 text-xs rounded-full dark:bg-gray-700 bg-gray-200 dark:text-gray-300">{tag}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${priorityColors[task.priority]}`}>{task.priority}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <svg className="w-10 h-10 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                      <p>No Tasks Found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {currentTasks.length > 0 && (
            <div className="flex justify-between items-center p-4 dark:border-t border-gray-700 bg-white text-sm text-gray-400">
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
      )}
      
      {viewMode === 'kanban' && <KanbanView />}
    </div>
    
  );
}