'use client'

import { 
  BarChart3, 
  Filter, 
  RefreshCw, 
  Search, 
  ChevronUp, 
  ChevronDown, 
  AlertCircle,
  Download,
  User,
  Tag,
  Plus,
  X,
  MessageSquare,
  Calendar,
  Clock
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

// TypeScript interfaces
interface Project {
  id: number;
  subject: string;
  department: string;
  contact: string;
  tags: string[];
  priority: string;
  last_reply: string;
  created: string;
  status: 'Open' | 'In Progress' | 'On Hold' | 'Answered' | 'Closed';
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
  department: string[];
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
      tags: [],
      department: []
    });
    
    // Sample ticket data
    const [projects, setProjects] = useState<Project[]>([
      {
        id: 1,
        subject: "Login Authentication Error",
        department: "Technical Support",
        contact: "john.doe@example.com",
        tags: ["Authentication", "Bug"],
        priority: "High",
        last_reply: "2023-05-10",
        created: "2023-05-01",
        status: "In Progress"
      },
      {
        id: 2,
        subject: "Billing Question for Invoice #3920",
        department: "Billing",
        contact: "sarah.smith@example.com",
        tags: ["Invoice", "Payment"],
        priority: "Medium",
        last_reply: "2023-05-12",
        created: "2023-05-08",
        status: "Open"
      },
      {
        id: 3,
        subject: "Feature Request: Dark Mode Implementation",
        department: "Product Development",
        contact: "alex.johnson@example.com",
        tags: ["Feature Request", "UI/UX"],
        priority: "Low",
        last_reply: "2023-04-30",
        created: "2023-04-25",
        status: "On Hold"
      },
      {
        id: 4,
        subject: "Account Deactivation Request",
        department: "Customer Support",
        contact: "emily.parker@example.com",
        tags: ["Account", "GDPR"],
        priority: "High",
        last_reply: "2023-05-11",
        created: "2023-05-10",
        status: "Closed"
      },
      {
        id: 5,
        subject: "Integration with Third-party Service",
        department: "Technical Support",
        contact: "michael.wilson@example.com",
        tags: ["Integration", "API"],
        priority: "Medium",
        last_reply: "2023-05-03",
        created: "2023-04-20",
        status: "Answered"
      },
      {
        id: 6,
        subject: "Password Reset Issue",
        department: "Technical Support",
        contact: "jessica.brown@example.com",
        tags: ["Password", "Security"],
        priority: "High",
        last_reply: "2023-05-13",
        created: "2023-05-12",
        status: "Open"
      }
    ]);

    // Get all unique tags and departments from tickets
    const allTags = [...new Set(projects.flatMap(project => project.tags))];
    const allDepartments = [...new Set(projects.map(project => project.department))];

    const listNumber: Record<string | number, string> = {
        10: '10',
        25: '25',
        50: '50',
        100: '100',
        'all': 'All'
    };

    const tableHeaders: TableHeader[] = [
        { id: 'id', label: '#', icon: <span className="text-xs"></span> },
        { id: 'subject', label: 'Subject', icon: <MessageSquare size={14} /> },
        { id: 'tags', label: 'Tags', icon: <Tag size={14} /> },
        { id: 'department', label: 'Department', icon: <User size={14} /> },
        { id: 'contact', label: 'Contact', icon: <User size={14} /> },
        { id: 'status', label: 'Status' },
        { id: 'priority', label: 'Priority' },
        { id: 'last_reply', label: 'Last Reply', icon: <Clock size={14} /> },
        { id: 'created', label: 'Created', icon: <Calendar size={14} /> },
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
                className={`cursor-pointer py-1.5 flex px-3 rounded-lg text-[12px] gap-1.5 items-center transition-all duration-200
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
            
            // Department filter
            if (filterConfig.department.length > 0 && !filterConfig.department.includes(project.department)) {
                return false;
            }
            
            // Search filter
            if (filterConfig.search) {
                const searchLower = filterConfig.search.toLowerCase();
                return (
                    project.subject.toLowerCase().includes(searchLower) ||
                    project.contact.toLowerCase().includes(searchLower) ||
                    project.department.toLowerCase().includes(searchLower) ||
                    project.tags.some(tag => tag.toLowerCase().includes(searchLower))
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
            
            // Handle arrays (like tags)
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
            if (key === 'created' || key === 'last_reply') {
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

    // Calculate days since last reply
    const calculateDaysSinceReply = (lastReply: string): number => {
        const today = new Date();
        const replyDate = new Date(lastReply);
        const diffTime = today.getTime() - replyDate.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    // Get reply status color
    const getReplyStatusColor = (lastReply: string, status: string): string => {
        if (status === 'Closed') return 'text-gray-400 dark:text-gray-500';
        
        const daysSince = calculateDaysSinceReply(lastReply);
        
        if (daysSince > 3) return 'text-red-600 dark:text-red-400 font-medium';
        if (daysSince > 1) return 'text-amber-600 dark:text-amber-400';
        return 'text-green-600 dark:text-green-400';
    };

    // Get status color
    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'Open':
                return 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-200';
            case 'In Progress':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'On Hold':
                return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
            case 'Closed':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
            case 'Answered':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            default:
                return '';
        }
    };

    // Get priority color
    const getPriorityColor = (priority: string): string => {
        switch (priority) {
            case 'High':
                return 'text-red-600 dark:text-red-400';
            case 'Medium':
                return 'text-amber-600 dark:text-amber-400';
            case 'Low':
                return 'text-blue-600 dark:text-blue-400';
            default:
                return 'text-gray-600 dark:text-gray-400';
        }
    };

    // "No content" display component
    const EmptyStateMessage = (): React.ReactElement => (
        <tr>
            <td colSpan={tableHeaders.length} className="text-center py-12">
                <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-3">
                        <AlertCircle size={32} className="text-gray-400 dark:text-gray-300" />
                    </div>
                    <p className="text-gray-700 dark:text-gray-200 font-medium text-lg">No Tickets Found</p>
                    <p className="text-gray-500 text-sm max-w-md">
                        Try adjusting your search or filter criteria, or create a new ticket to get started.
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

    // Toggle department filter
    const toggleDepartmentFilter = (dept: string): void => {
        setFilterConfig(prev => {
            const newDepts = prev.department.includes(dept)
                ? prev.department.filter(d => d !== dept)
                : [...prev.department, dept];
            return { ...prev, department: newDepts };
        });
        setCurrentPage(1); // Reset to first page when filter changes
    };

    // Clear all filters
    const clearAllFilters = (): void => {
        setFilterConfig({ status: [], search: '', tags: [], department: [] });
        setSortConfig({ key: '', direction: '' });
        setCurrentPage(1);
    };

    // Calculate if filters are active
    const hasActiveFilters = filterConfig.status.length > 0 || 
                          filterConfig.tags.length > 0 || 
                          filterConfig.department.length > 0 ||
                          filterConfig.search.length > 0 ||
                          sortConfig.key !== '';

    return (
        <div className='flex-1 pb-16 pr-6 flex flex-col text-indigo-600 dark:text-gray-100 gap-3'>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Support Tickets</h1>
                    <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 px-2 py-0.5 rounded-full text-xs font-medium">
                        {projects.length}
                    </span>
                </div>
            </div>
            
            <div className="flex justify-between items-center mt-1">
                <div className="flex gap-1.5 items-center">
                    <button className='cursor-pointer py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 shadow-sm text-xs text-white border border-indigo-700 transition-colors duration-200 flex items-center gap-1'>
                        <Plus size={14} />
                        New Ticket
                    </button>
                    <button className='cursor-pointer py-1.5 px-2 rounded-lg bg-white dark:bg-gray-700 shadow-sm text-sm hover:bg-indigo-50 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-200 border border-gray-200 dark:border-gray-600 transition-colors duration-200' title='Chart View'>
                        <BarChart3 size={16} />
                    </button>
                    <div className="flex gap-2">
                        <StatusFilterButton 
                            status="Open" 
                            count={getStatusCount('Open')} 
                            color="text-red-700 dark:text-red-200" 
                            bgColor="bg-red-100 dark:bg-red-600" 
                            borderColor="border-red-300 dark:border-red-500"
                        />
                        <StatusFilterButton 
                            status="In Progress" 
                            count={getStatusCount('In Progress')} 
                            color="text-green-700 dark:text-green-300" 
                            bgColor="bg-green-50 dark:bg-green-900" 
                            borderColor="border-green-200 dark:border-green-700"
                        />
                        <StatusFilterButton 
                            status="On Hold" 
                            count={getStatusCount('On Hold')} 
                            color="text-amber-700 dark:text-amber-300" 
                            bgColor="bg-amber-50 dark:bg-amber-900" 
                            borderColor="border-amber-200 dark:border-amber-700"
                        />
                        <StatusFilterButton 
                            status="Answered" 
                            count={getStatusCount('Answered')} 
                            color="text-blue-700 dark:text-blue-300" 
                            bgColor="bg-blue-50 dark:bg-blue-900" 
                            borderColor="border-blue-200 dark:border-blue-700"
                        />
                        <StatusFilterButton 
                            status="Closed" 
                            count={getStatusCount('Closed')} 
                            color="text-gray-700 dark:text-gray-300" 
                            bgColor="bg-gray-50 dark:bg-gray-900" 
                            borderColor="border-gray-200 dark:border-gray-700"
                        />
                    </div>
                </div>
                <div className="relative" ref={filterDropdownRef}>
                    <button 
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`cursor-pointer py-1.5 flex px-3 rounded-lg text-[12px] gap-2 border items-center transition-colors duration-200
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
                                {filterConfig.status.length + filterConfig.tags.length + filterConfig.department.length + (filterConfig.search ? 1 : 0) + (sortConfig.key ? 1 : 0)}
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
                                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto mb-3">
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
                                
                                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Departments</h4>
                                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto mb-3">
                                    {allDepartments.map((dept, index) => (
                                        <button
                                            key={index}
                                            onClick={() => toggleDepartmentFilter(dept)}
                                            className={`px-2 py-1 rounded-md text-xs font-medium transition-colors duration-200
                                                ${filterConfig.department.includes(dept)
                                                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700'
                                                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                }
                                            `}
                                        >
                                            {filterConfig.department.includes(dept) && <span>✓ </span>}
                                            {dept}
                                        </button>
                                    ))}
                                </div>
                                
                                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-4 mb-2">Sort By</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {['subject', 'priority', 'last_reply', 'created'].map((field) => (
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
                                            <span>{field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')}</span>
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
                    <div className="flex gap-2 items-center">
                        <div className="" ref={dropdownRef}>
                            <div className="relative w-fit">
                                <button 
                                onClick={() => setIsOpen(!isOpen)}
                                className="flex items-center cursor-pointer pl-4 pr-2 py-1.5 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-md gap-1.5 text-xs border border-gray-200 dark:border-gray-600 font-medium outline-0 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200" 
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
                                <div className="absolute left-0 mt-2 text-xs  w-28 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 border border-gray-200 dark:border-gray-600 z-10">
                                    {Object.entries(listNumber).map(([code, name]) => (
                                    <button
                                        key={String(code)}
                                        onClick={() => {setListNo(code === 'all' ? 'all' : Number(code));
                                        setIsOpen(false);
                                        setCurrentPage(1); // Reset to first page when changing list size
                                        }}
                                        className={`block w-full text-left px-4 py-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-600 ${
                                        code === String(listNo) ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'
                                        }`}
                                    >
                                        {name}
                                    </button>
                                    ))}
                                </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-1 px-3 py-1.5 rounded-md text-gray-700 dark:text-gray-300 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                            <span>Total:</span>
                            <span className="font-medium">{getSortedData().length}</span>
                        </div>
                        <button
                            onClick={clearAllFilters}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900 transition-colors duration-200"
                        >
                            <RefreshCw size={14} />
                            <span>Reset</span>
                        </button>
                                                {/* For testing empty state */}
                        <button 
                            onClick={clearProjects}
                            className="ml-2 py-1.5 px-3 text-xs bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 rounded-md border border-red-200 dark:border-red-700 transition-colors duration-200"
                        >
                            Clear Tickets
                        </button>
                    </div>

                    <div className="relative w-64">
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            value={filterConfig.search}
                            onChange={handleSearch}
                            className="w-full pl-9 pr-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 focus:ring-1 focus:ring-indigo-300 dark:focus:ring-indigo-700 focus:border-indigo-300 dark:focus:border-indigo-700 outline-none transition-colors duration-200"
                        />
                        <div className="absolute left-0 top-0 h-full flex items-center justify-center pl-3">
                            <Search size={14} className="text-gray-400" />
                        </div>
                    </div>
                </div>

                <div className="pb-3">
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    {tableHeaders.map((header) => (
                                        <th 
                                            key={header.id}
                                            className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300"
                                        >
                                            <div 
                                                className={`flex items-center gap-1 ${header.id !== 'id' ? 'cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400' : ''}`}
                                                onClick={() => header.id !== 'id' && handleSort(header.id)}
                                            >
                                                {header.icon && <span>{header.icon}</span>}
                                                <span>{header.label}</span>
                                                {getSortDirectionIcon(header.id)}
                                            </div>
                                        </th>
                                    ))}
                                    <th className="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getPaginatedData().length > 0 ? (
                                    getPaginatedData().map((project) => (
                                        <tr 
                                            key={project.id}
                                            className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                                        >
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-300 font-medium">#{project.id}</td>
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-gray-800 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">
                                                    {project.subject}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {project.tags.map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{project.department}</td>
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{project.contact}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(project.status)}`}>
                                                    {project.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`font-medium ${getPriorityColor(project.priority)}`}>
                                                    {project.priority}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className={`flex items-center gap-1.5 ${getReplyStatusColor(project.last_reply, project.status)}`}>
                                                    <span>{formatDate(project.last_reply)}</span>
                                                    <span className="text-xs">
                                                        ({calculateDaysSinceReply(project.last_reply)}d)
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                                                {formatDate(project.created)}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex gap-2 justify-end">
                                                    <button className="p-1 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors duration-200">
                                                        <MessageSquare size={16} />
                                                    </button>
                                                    <button className="p-1 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors duration-200">
                                                        <Download size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <EmptyStateMessage />
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                {getPaginatedData().length > 0 && (
                    <div className="flex justify-between items-center px-4 py-3">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            Showing {((currentPage - 1) * Number(listNo)) + 1} to {Math.min(currentPage * Number(listNo), getSortedData().length)} of {getSortedData().length} entries
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium ${currentPage === 1 ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                            >
                                Previous
                            </button>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{currentPage} / {totalPages()}</span>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages()))}
                                disabled={currentPage === totalPages()}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium ${currentPage === totalPages() ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
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
           