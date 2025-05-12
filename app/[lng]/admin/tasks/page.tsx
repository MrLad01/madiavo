'use client';
import {
  ArrowRight,
  Filter,
  Search,
  RotateCw,
  ArrowUpDown,
  LayoutGrid,
  List,
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
  'Not Started': 'text-yellow-400',
  'In Progress': 'text-purple-500',
  Testing: 'text-blue-400',
  'Awaiting Feedback': 'text-green-400',
  Complete: 'text-green-500',
};

const priorityColors: Record<Task['priority'], string> = {
  Critical: 'text-red-500',
  High: 'text-orange-500',
  Medium: 'text-yellow-500',
  Low: 'text-blue-500',
};

export default function TaskPage() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterConfig>({});
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
    'Not Started': filteredTasks.filter((t) => t.status === 'Not Started').length,
    'In Progress': filteredTasks.filter((t) => t.status === 'In Progress').length,
    Testing: filteredTasks.filter((t) => t.status === 'Testing').length,
    'Awaiting Feedback': filteredTasks.filter((t) => t.status === 'Awaiting Feedback').length,
    Complete: filteredTasks.filter((t) => t.status === 'Complete').length,
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

  // Grid View Renderer
  const GridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {currentTasks.map((task) => (
        <div 
          key={task.id} 
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{task.id}</span>
            <span className={`text-xs font-semibold ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
          </div>
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
            {task.name}
          </h3>
          <div className="flex justify-between items-center mt-4">
            <span className={`text-sm ${statusColors[task.status]}`}>
              {task.status}
            </span>
            <div className="flex gap-1">
              {task.tags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

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
    <div className="flex-1 ml-[20vw] pb-16 pr-6 flex flex-col text-indigo-600 dark:text-gray-100 gap-2">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold dark:text-gray-300 text-gray-600">Tasks</h1>
        <Link href="/" className="flex items-center gap-2 py-1">
          <p className="text-sm dark:text-gray-300 text-gray-600">Tasks Overview</p>
          <ArrowRight size={16} className='dark:text-gray-300 text-gray-600' />
        </Link>
      </div>

      {/* Cards */}
      <div className="flex gap-2">
        {Object.entries(taskCounts).map(([status, count]) => (
          <div 
            key={status} 
            className="flex items-center w-[19%] border border-gray-400 dark:border-gray-50/20 bg-white px-4 rounded-xl dark:bg-gray-800/50 shadow-xs hover:bg-gray-100 dark:hover:bg-gray-400 hover:text-indigo-700 dark:hover:text-blue-200 cursor-pointer"
          >
            <div className="flex flex-col p-2">
              <h2 className="text-sm text-gray-600 font-medium">
                {count}{' '}
                <span className={`${statusColors[status as Task['status']]} ml-1.5`}>
                  {status}
                </span>
              </h2>
              <p className="text-sm font-normal text-gray-600 dark:text-gray-400">
                My Tasks: {count}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between pr-8 mt-4 relative">
        <button 
          onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')} 
          className="flex items-center justify-start gap-2 border border-gray-400 rounded-md px-2 py-2 shadow-xs bg-white hover:bg-gray-100 dark:hover:bg-gray-400 dark:hover:text-blue-200 dark:bg-transparent"
        >
          {viewMode === 'list' ? <LayoutGrid size={16} className='dark:text-gray-100 text-gray-400' /> : <List size={16} className='dark:text-gray-100 text-gray-400' />}
        </button>
        <div className="relative">
          <button 
            onClick={() => setFilterOpen(!filterOpen)} 
            className="flex items-center justify-end border gap-2 py-1 rounded-xl border-gray-400 px-2 text-gray-500 shadow-xs text-sm dark:text-gray-400 dark:bg-transparent bg-white hover:bg-gray-100 dark:hover:bg-gray-400 dark:hover:text-blue-200"
          >
            <Filter size={16} />
            Filters
          </button>
          {filterOpen && <FilterDropdown />}
        </div>
      </div>

      {/* Tasks Display */}
      {viewMode === 'list' ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 mt-4 overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 text-xs">
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
              <input type="text" placeholder="Search..." className="pl-10 pr-4 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300" />
            </div>
          </div>

          {/* Table */}
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-sm">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" onChange={handleSelectAll} checked={selectedTasks.length === currentTasks.length} className="rounded" />
                </th>
                {['#', 'name', 'status', 'startDate', 'dueDate', 'assignedTo', 'tags', 'priority'].map((key) => (
                  <th key={key} className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400 cursor-pointer" onClick={() => requestSort(key as SortKey)}>
                    <div className="flex items-center gap-1 capitalize">
                      {key}
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentTasks.map((task) => (
                <tr key={task.id} className="border-b border-b-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selectedTasks.includes(task.id)} onChange={(e) => handleSelectTask(e, task.id)} className="rounded" />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{task.id}</td>
                  <td className="px-4 py-3 text-sm font-normal">{task.name}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-normal ${statusColors[task.status]}`}>{task.status}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{task.startDate}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{task.dueDate}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{task.assignedTo}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {task.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${priorityColors[task.priority]}`}>{task.priority}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700 text-sm">
            <span className="text-gray-700 dark:text-gray-300">Page {currentPage} of {totalPages}</span>
            <div className="flex gap-2">
              <button onClick={handlePreviousPage} disabled={currentPage === 1} className={`px-3 py-1 rounded border text-gray-500 ${currentPage === 1 ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed' : 'bg-white  dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-600'}`}>
                Previous
              </button>
              <button onClick={handleNextPage} disabled={currentPage === totalPages} className={`px-3 py-1 rounded border text-gray-500 ${currentPage === totalPages ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-600'}`}>
                Next
              </button>
            </div>
          </div>
        </div>
      ) : (
        <GridView />
      )}
    </div>
  );
}