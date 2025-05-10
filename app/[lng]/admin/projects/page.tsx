'use client'

import { BarChart3, Filter, RefreshCw, Search, ChevronUp, ChevronDown, AlertCircle } from 'lucide-react'
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
}

interface TableHeader {
  id: keyof Project;
  label: string;
}

interface SortConfig {
  key: keyof Project | '';
  direction: 'asc' | 'desc' | '';
}

interface SortButtonProps {
  value: number;
  title: string;
  color: string;
}

export default function Page(): React.ReactElement {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [listNo, setListNo] = useState<number | string>(10);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: '' });
    const [projects, setProjects] = useState<Project[]>([
      // Sample data - empty this array to test the empty state
      {
        id: 1,
        name: 'Website Redesign',
        customer: 'Acme Corp',
        tags: ['Design', 'Frontend'],
        startDate: '2023-01-01',
        deadline: '2023-06-30',
        members: ['John', 'Sarah'],
        status: 'In Progress'
      },
      {
        id: 2,
        name: 'Mobile App Development',
        customer: 'TechGiant',
        tags: ['Mobile', 'Backend'],
        startDate: '2023-02-15',
        deadline: '2023-08-01',
        members: ['Mike', 'Lisa', 'Tom'],
        status: 'Not Started'
      },
      {
        id: 3,
        name: 'Database Migration',
        customer: 'DataSystems',
        tags: ['Database', 'Backend'],
        startDate: '2022-11-10',
        deadline: '2023-03-15',
        members: ['Alex'],
        status: 'Finished'
      }
    ]);

    const languages: Record<string, string> = {
        en: 'English',
        de: 'Deutsch',
        fr: 'Français',
        it: 'Italiano',
        lt: 'Lietuvių'
    };

    const listNumber: Record<string | number, string> = {
        10: '10',
        25: '25',
        50: '50',
        100: '100',
        'all': 'All'
    };

    const tableHeaders: TableHeader[] = [
        { id: 'id', label: '#' },
        { id: 'name', label: 'Project Name' },
        { id: 'customer', label: 'Customer' },
        { id: 'tags', label: 'Tags' },
        { id: 'startDate', label: 'Start Date' },
        { id: 'deadline', label: 'Deadline' },
        { id: 'members', label: 'Members' },
        { id: 'status', label: 'Status' }
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent): void => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const SortButton: React.FC<SortButtonProps> = ({ value, title, color }) => {
        return (
            <button className='cursor-pointer py-1 flex px-3 rounded-lg bg-white dark:bg-transparent shadow-xs text-[13px] hover:bg-indigo-100 dark:hover:bg-blue-900 hover:text-indigo-700 dark:hover:text-blue-200 gap-1.5 border border-indigo-100 dark:border-gray-500 dark:hover:border items-center'>
                <span className='font-semibold text-gray-400'>{value}</span>
                <span className={`${color} font-extralight`}>{title}</span>
            </button>
        );
    };

    // Sort handler function
    const handleSort = (key: keyof Project): void => {
        let direction: 'asc' | 'desc' = 'asc';
        
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        
        setSortConfig({ key, direction });
    };

    // Get sorted data
    const getSortedData = (): Project[] => {
        if (!sortConfig.key) return projects;
        
        return [...projects].sort((a: Project, b: Project) => {
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

    // Get sort indicator icon
    const getSortDirectionIcon = (headerId: keyof Project): React.ReactNode => {
        if (sortConfig.key === headerId) {
            return sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
        }
        return null;
    };

    // "No content" display component
    const EmptyStateMessage = (): React.ReactElement => (
        <tr>
            <td colSpan={tableHeaders.length} className="text-center py-8">
                <div className="flex flex-col items-center justify-center space-y-2">
                    <AlertCircle size={40} className="text-gray-400" />
                    <p className="text-gray-500 font-medium">No Entries found</p>
                    <p className="text-gray-400 text-sm">Try adjusting your filters or search criteria</p>
                </div>
            </td>
        </tr>
    );

    // Function to clear projects (for testing empty state)
    const clearProjects = (): void => {
        setProjects([]);
    };

    return (
        <div className='flex-1 ml-[20vw] pb-16 pr-6 flex flex-col text-indigo-600 dark:text-gray-100 gap-2'>
            <div className="flex justify-between items-center">
                <div className="flex gap-4 items-center">
                    <button className='cursor-pointer py-1.5 px-2 rounded-lg bg-white dark:bg-transparent shadow-sm text-sm hover:bg-indigo-100 hover:border dark:hover:border dark:hover:bg-blue-900 hover:text-indigo-700 dark:hover:text-blue-200 gap-3 border border-indigo-100 dark:border-gray-500' title='Chart View'>
                        <BarChart3 size={16} />
                    </button>
                    <div className="flex gap-2">
                        <SortButton value={0} title={'Not Started'} color={'text-gray-500'} />
                        <SortButton value={0} title={'In Progress'} color={'text-purple-700'} />
                        <SortButton value={0} title={'On Hold'} color={'text-amber-400'} />
                        <SortButton value={0} title={'Cancelled'} color={'text-red-500'} />
                        <SortButton value={0} title={'Finished'} color={'text-green-400'} />
                    </div>
                </div>
                <button className='cursor-pointer py-1.5 flex px-3 rounded-lg bg-white dark:bg-transparent shadow-xs text-[13px] hover:bg-indigo-100 dark:hover:bg-blue-900 hover:text-indigo-700 dark:hover:text-blue-200 gap-1 border border-indigo-100 dark:border-gray-500 dark:hover:border items-center'>
                    <span className='font-semibold dark:text-gray-400 text-gray-600'><Filter size={18} /></span>
                    <span className='font-semibold dark:text-gray-400 text-gray-600'>Filters</span>
                </button>
            </div>
            <div className='w-full py-4 h-auto text-indigo-600 dark:text-gray-200 bg-white dark:bg-gray-800 dark:border dark:border-gray-600 rounded-md space-y-4'>
                <div className="px-4 flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                        <div className="" ref={dropdownRef}>
                            <div className="relative w-fit">
                                <button 
                                onClick={() => setIsOpen(!isOpen)}
                                className="flex items-center cursor-pointer pl-4 pr-1 py-1 text-indigo-600 dark:text-gray-300 rounded-md gap-3 text-sm border font-medium outline-0" title={'List Number'}
                                >
                                    {listNumber[listNo]}
                                    <svg 
                                        className="ml-2 h-4 w-4" 
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
                                <div className="absolute right-0 mt-2 w-20 bg-gray-200 rounded-md shadow-lg py-1">
                                    {Object.entries(listNumber).map(([code, name]) => (
                                    <button
                                        key={String(code)}
                                        onClick={() => {
                                                setListNo(code === 'all' ? 'all' : parseInt(code, 10));
                                                setIsOpen(false);}}
                                        className={`block w-full text-left px-4 py-2 text-sm ${
                                        listNo === (code === 'all' ? 'all' : parseInt(code, 10))
                                            ? 'bg-indigo-100 text-indigo-900 font-medium' 
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        {name}
                                    </button>
                                    ))}
                                </div>
                                )}
                            </div>
                        </div>
                        <div className="flex">
                            <button className='cursor-pointer py-1.5 px-2 rounded-s-lg bg-white dark:bg-transparent shadow-sm text-xs hover:bg-indigo-100 hover:border dark:hover:border dark:hover:bg-blue-900 hover:text-indigo-700 dark:hover:text-blue-200 gap-3 border border-indigo-100 dark:border-gray-500' title='Export'>
                                Export
                            </button>
                            <button className='cursor-pointer py-1.5 px-2 rounded-e-lg bg-white dark:bg-transparent shadow-sm text-xs hover:bg-indigo-100 hover:border dark:hover:border dark:hover:bg-blue-900 hover:text-indigo-700 dark:hover:text-blue-200 gap-3 border border-indigo-100 dark:border-gray-500' title='Refresh'>
                                <RefreshCw size={14} />
                            </button>
                        </div>
                        
                        {/* For testing empty state */}
                        <button 
                            onClick={clearProjects}
                            className="ml-4 py-1 px-3 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded-md border border-red-200"
                        >
                            Clear Projects (Test Empty State)
                        </button>
                    </div>
                    <div className="flex relative">
                        <input type="text" placeholder='search' className='border pl-8 py-1.5 text-sm rounded-md dark:border-gray-500' />  
                        <Search size={16} className='absolute left-1.5 top-1/2 -translate-y-1/2 text-indigo-400 dark:text-gray-500' />      
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className='w-full text-sm text-gray-500 dark:text-gray-400'>
                        <thead>
                            <tr className='text-left text-gray-500 dark:text-gray-400 border-b'>
                                {tableHeaders.map((header) => (
                                    <th key={header.id} className='border-r last:border-r-0'>
                                        <button 
                                            className='flex items-center justify-between pr-2 w-full pl-4 py-2 cursor-pointer gap-2 hover:bg-gray-50 dark:hover:bg-gray-700'
                                            onClick={() => handleSort(header.id)}
                                            title={`Sort by ${header.label}`}
                                        >
                                            <span className='font-semibold text-gray-400'>{header.label}</span>
                                            <div className="flex items-center">
                                                {getSortDirectionIcon(header.id) || (
                                                    <svg 
                                                        className="ml-2 h-4 w-4 text-gray-400 opacity-50" 
                                                        fill="none" 
                                                        viewBox="0 0 24 24" 
                                                        stroke="currentColor"
                                                    >
                                                        <path 
                                                            strokeLinecap="round" 
                                                            strokeLinejoin="round" 
                                                            strokeWidth={2} 
                                                            d="M19 9l-7 7-7-7" 
                                                        />
                                                    </svg>
                                                )}
                                            </div>
                                        </button>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {getSortedData().length > 0 ? (
                                getSortedData().map(project => (
                                    <tr key={project.id} className='text-left text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border-b last:border-b-0'>
                                        <td className='px-4 py-2'>{project.id}</td>
                                        <td className='px-4 py-2'>{project.name}</td>
                                        <td className='px-4 py-2'>{project.customer}</td>
                                        <td className='px-4 py-2'>
                                            <div className="flex flex-wrap gap-1">
                                                {project.tags.map((tag, idx) => (
                                                    <span key={idx} className="bg-indigo-100 dark:bg-indigo-900 text-xs px-2 py-0.5 rounded">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className='px-4 py-2'>{project.startDate}</td>
                                        <td className='px-4 py-2'>{project.deadline}</td>
                                        <td className='px-4 py-2'>
                                            <div className="flex -space-x-2">
                                                {project.members.map((member, idx) => (
                                                    <div key={idx} className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs">
                                                        {member.charAt(0)}
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className='px-4 py-2'>
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                project.status === 'In Progress' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                                                project.status === 'Not Started' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' :
                                                project.status === 'On Hold' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' :
                                                project.status === 'Cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            }`}>
                                                {project.status}
                                            </span>
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
        </div>
    );
}