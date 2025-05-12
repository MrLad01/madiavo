'use client'

import { 
  BarChart3, 
  Filter, 
  RefreshCw, 
  Search, 
  ChevronUp, 
  ChevronDown, 
  AlertCircle,
  Calendar,
  Download,
  User,
  Tag,
  Plus,
  X,
  MoreHorizontal,
  ArrowLeft,
  ArrowRight,
  Clock,
  Share
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

// TypeScript interfaces
interface Project {
  id: number;
  name: string;
  customer: string;
  tags: string[];
  startDate: string;
  deadline: string;
  members: string[];
  status: 'Not Started' | 'In Progress' | 'On Hold' | 'Cancelled' | 'Finished';
  progress?: number;
}

interface TableHeader {
  id: keyof Project;
  label: string;
  icon?: React.ReactNode;
}

interface SortConfig {
  key: keyof Project | '';
  direction: 'asc' | 'desc' | '';
}

interface FilterConfig {
  status: string[];
  search: string;
  tags: string[];
}

export default function Page(): React.ReactElement {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const filterDropdownRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
    const [listNo, setListNo] = useState<number | string>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: '' });
    const [filterConfig, setFilterConfig] = useState<FilterConfig>({
      status: [],
      search: '',
      tags: []
    });
    
    // Extended sample data with progress
    const [projects, setProjects] = useState<Project[]>([
      {
        id: 1,
        name: 'Website Redesign',
        customer: 'Acme Corp',
        tags: ['Design', 'Frontend'],
        startDate: '2023-01-01',
        deadline: '2023-06-30',
        members: ['John', 'Sarah'],
        status: 'In Progress',
        progress: 65
      },
      {
        id: 2,
        name: 'Mobile App Development',
        customer: 'TechGiant',
        tags: ['Mobile', 'Backend'],
        startDate: '2023-02-15',
        deadline: '2023-08-01',
        members: ['Mike', 'Lisa', 'Tom'],
        status: 'Not Started',
        progress: 0
      },
      {
        id: 3,
        name: 'Database Migration',
        customer: 'DataSystems',
        tags: ['Database', 'Backend'],
        startDate: '2022-11-10',
        deadline: '2023-03-15',
        members: ['Alex'],
        status: 'Finished',
        progress: 100
      },
      {
        id: 4,
        name: 'CRM Integration',
        customer: 'SalesBurst',
        tags: ['API', 'Backend', 'CRM'],
        startDate: '2023-03-01',
        deadline: '2023-09-15',
        members: ['Emma', 'David'],
        status: 'In Progress',
        progress: 42
      },
      {
        id: 5,
        name: 'Analytics Dashboard',
        customer: 'DataSystems',
        tags: ['Frontend', 'Data', 'UI/UX'],
        startDate: '2023-02-01',
        deadline: '2023-05-30',
        members: ['John', 'Sarah', 'Alex'],
        status: 'On Hold',
        progress: 35
      },
      {
        id: 6,
        name: 'Social Media Campaign',
        customer: 'MarketBoost',
        tags: ['Marketing', 'Design'],
        startDate: '2023-04-01',
        deadline: '2023-07-15',
        members: ['Lisa'],
        status: 'Cancelled',
        progress: 20
      }
    ]);

    // Get all unique tags from projects
    const allTags = [...new Set(projects.flatMap(project => project.tags))];

    const listNumber: Record<string | number, string> = {
        10: '10',
        25: '25',
        50: '50',
        100: '100',
        'all': 'All'
    };

    const tableHeaders: TableHeader[] = [
        { id: 'id', label: '#', icon: <span className="text-xs">#</span> },
        { id: 'name', label: 'Project Name' },
        { id: 'customer', label: 'Customer', icon: <User size={14} /> },
        { id: 'tags', label: 'Tags', icon: <Tag size={14} /> },
        { id: 'startDate', label: 'Start Date', icon: <Calendar size={14} /> },
        { id: 'deadline', label: 'Deadline', icon: <Clock size={14} /> },
        { id: 'members', label: 'Team', icon: <User size={14} /> },
        { id: 'status', label: 'Status' }
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent): void => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
            if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Status filter buttons
    interface StatusFilterButtonProps {
        status: string;
        count: number;
        color: string;
        bgColor: string;
        borderColor: string;
    }

    const StatusFilterButton: React.FC<StatusFilterButtonProps> = ({ status, count, color, bgColor, borderColor }) => {
        const isSelected = filterConfig.status.includes(status);
        
        return (
            <button 
                onClick={() => {
                    setFilterConfig(prev => {
                        const newStatus = isSelected 
                            ? prev.status.filter(s => s !== status)
                            : [...prev.status, status];
                        return { ...prev, status: newStatus };
                    });
                }}
                className={`cursor-pointer py-1.5 flex px-3 rounded-lg text-[13px] gap-1.5 items-center transition-all duration-200
                    ${isSelected 
                        ? `${bgColor} ${color} ${borderColor} border shadow-sm` 
                        : 'bg-white dark:bg-transparent hover:bg-indigo-50 dark:hover:bg-blue-900 border border-gray-200 dark:border-gray-600 dark:hover:border-gray-500'}
                `}
            >
                <span className={`font-medium ${isSelected ? color : 'text-gray-500 dark:text-gray-400'}`}>
                    {count}
                </span>
                <span className={`font-medium ${isSelected ? color : 'text-gray-700 dark:text-gray-300'}`}>
                    {status}
                </span>
                {isSelected && (
                    <X size={14} className={`ml-1 ${color}`} />
                )}
            </button>
        );
    };

    // Get status counts
    const getStatusCount = (status: string): number => {
        return projects.filter(project => project.status === status).length;
    };

    // Handle search input
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setFilterConfig(prev => ({ ...prev, search: e.target.value }));
        setCurrentPage(1); // Reset to first page on new search
    };

    // Sort handler function
    const handleSort = (key: keyof Project): void => {
        let direction: 'asc' | 'desc' = 'asc';
        
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        
        setSortConfig({ key, direction });
    };

    // Filter data
    const getFilteredData = (): Project[] => {
        return projects.filter(project => {
            // Status filter
            if (filterConfig.status.length > 0 && !filterConfig.status.includes(project.status)) {
                return false;
            }
            
            // Tag filter
            if (filterConfig.tags.length > 0 && !project.tags.some(tag => filterConfig.tags.includes(tag))) {
                return false;
            }
            
            // Search filter
            if (filterConfig.search) {
                const searchLower = filterConfig.search.toLowerCase();
                return (
                    project.name.toLowerCase().includes(searchLower) ||
                    project.customer.toLowerCase().includes(searchLower) ||
                    project.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
                    project.members.some(member => member.toLowerCase().includes(searchLower))
                );
            }
            
            return true;
        });
    };

    // Get sorted data
    const getSortedData = (): Project[] => {
        const filteredData = getFilteredData();
        
        if (!sortConfig.key) return filteredData;
        
        return [...filteredData].sort((a: Project, b: Project) => {
            const key = sortConfig.key as keyof Project;
            
            // Handle arrays (like tags, members)
            if (Array.isArray(a[key])) {
                const aArr = a[key] as unknown as string[];
                const bArr = b[key] as unknown as string[];
                
                if (aArr.length !== bArr.length) {
                    return sortConfig.direction === 'asc' 
                        ? aArr.length - bArr.length
                        : bArr.length - aArr.length;
                }
                return sortConfig.direction === 'asc'
                    ? aArr.join().localeCompare(bArr.join())
                    : bArr.join().localeCompare(aArr.join());
            }
            
            // Handle dates
            if (key === 'startDate' || key === 'deadline') {
                return sortConfig.direction === 'asc'
                    ? new Date(a[key] as string).getTime() - new Date(b[key] as string).getTime()
                    : new Date(b[key] as string).getTime() - new Date(a[key] as string).getTime();
            }
            
            // Handle strings
            if (typeof a[key] === 'string') {
                const aStr = a[key] as string;
                const bStr = b[key] as string;
                return sortConfig.direction === 'asc'
                    ? aStr.localeCompare(bStr)
                    : bStr.localeCompare(aStr);
            }
            
            // Handle numbers
            const aNum = a[key] as number;
            const bNum = b[key] as number;
            return sortConfig.direction === 'asc'
                ? aNum - bNum
                : bNum - aNum;
        });
    };

    // Get pagination data
    const getPaginatedData = (): Project[] => {
        const sortedData = getSortedData();
        
        if (listNo === 'all') return sortedData;
        
        const startIndex = (currentPage - 1) * Number(listNo);
        return sortedData.slice(startIndex, startIndex + Number(listNo));
    };

    // Get total pages
    const totalPages = (): number => {
        if (listNo === 'all') return 1;
        return Math.ceil(getSortedData().length / Number(listNo));
    };

    // Get sort indicator icon
    const getSortDirectionIcon = (headerId: keyof Project): React.ReactNode => {
        if (sortConfig.key === headerId) {
            return sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
        }
        return null;
    };

    // Format date to be more readable
    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    // Calculate days remaining for a deadline
    const calculateDaysRemaining = (deadline: string): number => {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    // Get deadline status color
    const getDeadlineStatusColor = (deadline: string, status: string): string => {
        if (status === 'Finished') return 'text-green-600 dark:text-green-400';
        if (status === 'Cancelled') return 'text-gray-400 dark:text-gray-500';
        
        const daysRemaining = calculateDaysRemaining(deadline);
        
        if (daysRemaining < 0) return 'text-red-600 dark:text-red-400 font-medium';
        if (daysRemaining < 7) return 'text-amber-600 dark:text-amber-400';
        return 'text-gray-600 dark:text-gray-300';
    };

    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'Not Started':
                return 'text-gray-600 dark:text-gray-300';
            case 'In Progress':
                return 'text-purple-600 dark:text-purple-400';
            case 'On Hold':
                return 'text-amber-600 dark:text-amber-400';
            case 'Cancelled':
                return 'text-red-600 dark:text-red-400';
            case 'Finished':
                return 'text-green-600 dark:text-green-400';
            default:
                return '';
        }
    }

    // "No content" display component
    const EmptyStateMessage = (): React.ReactElement => (
        <tr>
            <td colSpan={tableHeaders.length} className="text-center py-12">
                <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-3">
                        <AlertCircle size={32} className="text-gray-400 dark:text-gray-300" />
                    </div>
                    <p className="text-gray-700 dark:text-gray-200 font-medium text-lg">No Projects Found</p>
                    <p className="text-gray-500 text-sm max-w-md">
                        Try adjusting your search or filter criteria, or create a new project to get started.
                    </p>
                </div>
            </td>
        </tr>
    );

    // Function to clear projects (for testing empty state)
    const clearProjects = (): void => {
        setProjects([]);
    };

    // Toggle tag filter
    const toggleTagFilter = (tag: string): void => {
        setFilterConfig(prev => {
            const newTags = prev.tags.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...prev.tags, tag];
            return { ...prev, tags: newTags };
        });
        setCurrentPage(1); // Reset to first page when filter changes
    };

    // Clear all filters
    const clearAllFilters = (): void => {
        setFilterConfig({ status: [], search: '', tags: [] });
        setSortConfig({ key: '', direction: '' });
        setCurrentPage(1);
    };

    // Calculate if filters are active
    const hasActiveFilters = filterConfig.status.length > 0 || 
                          filterConfig.tags.length > 0 || 
                          filterConfig.search.length > 0 ||
                          sortConfig.key !== '';

    return (
        <div className='flex-1 ml-[20vw] pb-16 pr-6 flex flex-col text-indigo-600 dark:text-gray-100 gap-3'>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Projects</h1>
                    <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 px-2 py-0.5 rounded-full text-xs font-medium">
                        {projects.length}
                    </span>
                </div>
            </div>
            
            <div className="flex justify-between items-center mt-1">
                <div className="flex gap-2 items-center">
                    <button className='cursor-pointer py-1.5 px-2 rounded-lg bg-white dark:bg-gray-700 shadow-sm text-sm hover:bg-indigo-50 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-200 border border-gray-200 dark:border-gray-600 transition-colors duration-200' title='Chart View'>
                        <BarChart3 size={18} />
                    </button>
                    <div className="flex gap-2">
                        <StatusFilterButton 
                            status="Not Started" 
                            count={getStatusCount('Not Started')} 
                            color="text-gray-700 dark:text-gray-200" 
                            bgColor="bg-gray-100 dark:bg-gray-600" 
                            borderColor="border-gray-300 dark:border-gray-500"
                        />
                        <StatusFilterButton 
                            status="In Progress" 
                            count={getStatusCount('In Progress')} 
                            color="text-purple-700 dark:text-purple-300" 
                            bgColor="bg-purple-50 dark:bg-purple-900" 
                            borderColor="border-purple-200 dark:border-purple-700"
                        />
                        <StatusFilterButton 
                            status="On Hold" 
                            count={getStatusCount('On Hold')} 
                            color="text-amber-700 dark:text-amber-300" 
                            bgColor="bg-amber-50 dark:bg-amber-900" 
                            borderColor="border-amber-200 dark:border-amber-700"
                        />
                        <StatusFilterButton 
                            status="Cancelled" 
                            count={getStatusCount('Cancelled')} 
                            color="text-red-700 dark:text-red-300" 
                            bgColor="bg-red-50 dark:bg-red-900" 
                            borderColor="border-red-200 dark:border-red-700"
                        />
                        <StatusFilterButton 
                            status="Finished" 
                            count={getStatusCount('Finished')} 
                            color="text-green-700 dark:text-green-300" 
                            bgColor="bg-green-50 dark:bg-green-900" 
                            borderColor="border-green-200 dark:border-green-700"
                        />
                    </div>
                </div>
                <div className="relative" ref={filterDropdownRef}>
                    <button 
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`cursor-pointer py-1.5 flex px-3 rounded-lg text-[13px] gap-2 border items-center transition-colors duration-200
                            ${hasActiveFilters 
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900 dark:text-indigo-200 dark:border-indigo-700' 
                                : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:bg-indigo-50 dark:hover:bg-gray-600'
                            }
                        `}
                    >
                        <Filter size={16} className={hasActiveFilters ? 'text-indigo-600 dark:text-indigo-300' : ''} />
                        <span className="font-medium">
                            {hasActiveFilters ? 'Filters Active' : 'Filters'}
                        </span>
                        {hasActiveFilters && (
                            <span className="bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-300 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                {filterConfig.status.length + filterConfig.tags.length + (filterConfig.search ? 1 : 0) + (sortConfig.key ? 1 : 0)}
                            </span>
                        )}
                    </button>
                    
                    {isFilterOpen && (
                        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-3 z-10">
                            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
                                <h3 className="font-medium text-gray-700 dark:text-gray-200">Filters</h3>
                                {hasActiveFilters && (
                                    <button 
                                        onClick={clearAllFilters}
                                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>
                            <div className="px-4 py-3">
                                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Tags</h4>
                                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                                    {allTags.map((tag, index) => (
                                        <button
                                            key={index}
                                            onClick={() => toggleTagFilter(tag)}
                                            className={`px-2 py-1 rounded-md text-xs font-medium transition-colors duration-200
                                                ${filterConfig.tags.includes(tag)
                                                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700'
                                                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                }
                                            `}
                                        >
                                            {filterConfig.tags.includes(tag) && <span>✓ </span>}
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                                
                                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-4 mb-2">Sort By</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {['name', 'deadline', 'startDate', 'status'].map((field) => (
                                        <button
                                            key={field}
                                            onClick={() => handleSort(field as keyof Project)}
                                            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center justify-between transition-colors duration-200
                                                ${sortConfig.key === field
                                                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700'
                                                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                }
                                            `}
                                        >
                                            <span>{field.charAt(0).toUpperCase() + field.slice(1)}</span>
                                            {sortConfig.key === field && (
                                                sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <div className='w-full py-4 h-auto text-indigo-600 dark:text-gray-200 bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-lg shadow-sm space-y-4'>
                <div className="px-4 flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                        <div className="" ref={dropdownRef}>
                            <div className="relative w-fit">
                                <button 
                                onClick={() => setIsOpen(!isOpen)}
                                className="flex items-center cursor-pointer pl-4 pr-2 py-1.5 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-md gap-2 text-sm border border-gray-200 dark:border-gray-600 font-medium outline-0 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200" 
                                title={'List Number'}
                                >
                                    <span>Show:</span> {listNumber[listNo]}
                                    <svg 
                                        className="h-4 w-4" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                    >
                                        <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d={isOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} 
                                        />
                                    </svg>
                                </button>

                                {isOpen && (
                                <div className="absolute left-0 mt-2 w-28 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 border border-gray-200 dark:border-gray-600 z-10">
                                    {Object.entries(listNumber).map(([code, name]) => (
                                    <button
                                        key={String(code)}
                                        onClick={() => {
                                                setListNo(code === 'all' ? 'all' : parseInt(code, 10));
                                                setIsOpen(false);
                                                setCurrentPage(1); // Reset to first page when changing page size
                                            }}
                                        className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
                                        listNo === (code === 'all' ? 'all' : parseInt(code, 10))
                                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 font-medium' 
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        {name} per page
                                    </button>
                                    ))}
                                </div>
                                )}
                            </div>
                        </div>
                        <div className="flex">
                            <button className='cursor-pointer py-1.5 px-3 rounded-s-lg bg-white dark:bg-gray-700 shadow-sm text-sm hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors duration-200 gap-2 border border-gray-200 dark:border-gray-600 flex items-center' title='Export'>
                                <Download size={16} />
                                <span>Export</span>
                            </button>
                            <button className='cursor-pointer py-1.5 px-3 rounded-e-lg bg-white dark:bg-gray-700 shadow-sm text-sm hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors duration-200 border-t border-r border-b border-gray-200 dark:border-gray-600' title='Refresh'>
                                <RefreshCw size={16} />
                            </button>
                        </div>
                        
                        {/* For testing empty state */}
                        <button 
                            onClick={clearProjects}
                            className="ml-2 py-1.5 px-3 text-xs bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 rounded-md border border-red-200 dark:border-red-700 transition-colors duration-200"
                        >
                            Clear Projects
                        </button>
                    </div>
                    <div className="flex relative">
                        <input 
                            type="text" 
                            value={filterConfig.search}
                            onChange={handleSearch}
                            placeholder='Search projects...' 
                            className='border border-gray-200 dark:border-gray-600 pl-9 pr-4 py-2 text-sm rounded-lg w-64 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors duration-200'
                        />
                        <span className="absolute left-3 top-2 text-gray-400">
                            <Search size={16} />   
                        </span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm">
                        <thead>
                            <tr className="text-left text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700">
                                {tableHeaders.map((header) => (
                                    <th 
                                        key={header.id} 
                                        className={`px-4 py-3 text-sm font-medium ${header.id === 'status' ? 'text-center' : ''}`}
                                    >
                                        <div 
                                            className={`flex items-center gap-2 cursor-pointer ${header.icon ? 'justify-between' : 'justify-start'}`}
                                            onClick={() => handleSort(header.id)}
                                        >
                                            {header.label}
                                            {header.icon}
                                            {getSortDirectionIcon(header.id)}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {getPaginatedData().length > 0 ? (
                                getPaginatedData().map((project) => (
                                    <tr key={project.id} className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                        <td className="px-4 py-3 text-sm font-medium">{project.id}</td>
                                        <td className="px-4 py-3 text-sm font-medium">{project.name}</td>
                                        <td className="px-4 py-3 text-sm font-medium">{project.customer}</td>
                                        <td className="px-4 py-3 text-sm font-medium">
                                            {project.tags.join(', ')}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium">{formatDate(project.startDate)}</td>
                                        <td className={`px-4 py-3 text-sm font-medium ${getDeadlineStatusColor(project.deadline, project.status)}`}>
                                            {formatDate(project.deadline)}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium">{project.members.join(', ')}</td>
                                        <td className={`px-4 py-3 text-sm font-medium ${getStatusColor(project.status)}`}>
                                            {project.status}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <EmptyStateMessage />
                            )}
                        </tbody>
                    </table>
                </div>
                {getPaginatedData().length > 0 && (
                    <div className="flex justify-between items-center px-4 py-3">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Showing {((currentPage - 1) * Number(listNo)) + 1} to {Math.min(currentPage * Number(listNo), getSortedData().length)} of {getSortedData().length} entries
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium ${currentPage === 1 ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                            >
                                Previous
                            </button>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{currentPage} / {totalPages()}</span>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages()))}
                                disabled={currentPage === totalPages()}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium ${currentPage === totalPages() ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}