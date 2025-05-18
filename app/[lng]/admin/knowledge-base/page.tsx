'use client'
import { ArrowRight, ArrowUpDown, ChevronDown, Filter, Plus, RotateCw, Search, X,  Bold,
  Italic,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image,
  MoreHorizontal,
  Link2,
   } from 'lucide-react'
import { useState, useEffect } from 'react'
import _ from 'lodash'
import Link from 'next/link';

// Define TypeScript interfaces for our data
interface Article {
  id: number;
  articleName: string;
  group: string;
  datePublished: string;
}

interface SortConfig {
  key: keyof Article | null;
  direction: 'ascending' | 'descending' | null;
}

// Initial dummy data - empty to match the image
const dummyArticles: Article[] = [];

export default function Knowledgebase() {
  const [articles, setArticles] = useState<Article[]>(dummyArticles);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(dummyArticles);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: null });
  const [showNewArticleModal, setShowNewArticleModal] = useState<boolean>(false);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [groupColor, setGroupColor] = useState('#DE3A3A');

  // Select/deselect all rows
  useEffect(() => {
    if (selectAll) {
      setSelectedRows(filteredArticles.map(subscription => subscription.id));
    } else {
      setSelectedRows([]);
    }
  }, [selectAll, filteredArticles]);

  // Handle row selection
  const toggleRowSelection = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Handle column sorting
  const requestSort = (key: keyof Article | null) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    // Apply sorting
    const sortedItems = [...filteredArticles].sort((a, b) => {
      if (!key) return 0;
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setFilteredArticles(sortedItems);
  };

  

  
  const handleAddNewArticle = (e: React.FormEvent) => {
      e.preventDefault();
      // Implementation would go here
      setShowNewArticleModal(false);
    };

  return (
    <div className="flex-1 dark:bg-black bg-white min-h-screen flex flex-col text-indigo-600 overflow-x-hidden dark:text-gray-100">  
      <div className='px-4 mt-2'>
        <h1 className="text-2xl font-bold dark:text-gray-300 text-gray-700">Knowledge Base</h1>
        <div className="flex items-center gap-2 py-1">
          <Link href="" className="text-sm dark:text-gray-300 text-gray-600">Groups</Link>
          <ArrowRight size={16} className='dark:text-gray-300 text-gray-600' />
        <Link href={''} className="text-sm dark:text-gray-300 text-gray-600 ml-2">View Kanban</Link>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-between p-4 pb-4">
        <button onClick={() => setShowNewArticleModal(true)} className="flex items-center justify-between text-sm px-4 py-2 cursor-pointer rounded-lg bg-blue-500 text-white hover:bg-blue-600">
          <Plus size={18} className="mr-2" /> New Article
        </button>
        <button className="flex items-center justify-center gap-1 py-2 px-4 rounded-lg border border-gray-400 text-gray-500 shadow-sm text-sm dark:text-gray-200 dark:bg-transparent bg-white hover:bg-gray-100 dark:hover:bg-gray-800">
          <Filter size={18} className="mr-2" /> Filters
        </button>
      </div>
      
      {/* Main content area */}
      <div className="mx-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden">        
        
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
                <th className="p-4 text-sm font-medium text-gray-400 cursor-pointer" onClick={() => requestSort('articleName')}>
                  <div className="flex items-center">
                    Article Name <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-4 text-sm font-medium text-gray-400 cursor-pointer" onClick={() => requestSort('group')}>
                  <div className="flex items-center">
                    Group <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-4 text-sm font-medium text-gray-400 cursor-pointer" onClick={() => requestSort('datePublished')}>
                  <div className="flex items-center">
                    Date Published <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((subscription) => (
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
                    <td className="p-4 text-gray-300">{subscription.articleName}</td>
                    <td className="p-4 text-gray-300">{subscription.group}</td>
                    <td className="p-4 text-gray-300">{subscription.datePublished}</td>
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
    
      {showNewArticleModal &&
      (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800  border border-gray-700 rounded-lg w-full max-w-[38rem] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center bg-blue-400 p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Add New Article</h2>
          <button 
            onClick={() => setShowNewArticleModal(false)} 
            className="text-gray-400 hover:text-white"
          >
            <X size={20} color='#fff' />
          </button>
        </div>
        
        <div className="p-6 dark:bg-gray-800 bg-white">
            <div>
              <div className="mb-4">
                <label className="flex mb-1 text-sm text-gray-400">
                  <span className="text-red-500 mr-1">*</span> Subject
                </label>
                <input 
                  type="text" 
                  className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 dark:text-white text-gray-400"
                />
              </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm">
              <span className="text-red-500 mr-1">*</span>Group
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <select className="w-full dark:bg-gray-900 bg-white border border-gray-700 rounded p-2 dark:text-white text-gray-400 appearance-none pr-8">
                  <option></option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
              </div>
              <button 
                onClick={() => setShowNewGroupModal(true)}
                className="dark:bg-gray-900 border border-gray-700 rounded p-2"
              >
                <Plus size={20} className='text-gray-400' />
              </button>
            </div>
          </div>

              <div className="flex items-center mb-2">
                <input 
                  type="checkbox" 
                  id="articleCheckbox"
                  className="mr-2"
                />
                <label htmlFor="articleCheckbox" className="text-gray-700 text-xs dark:text-gray-300"> Internal Article
                </label>
              </div>
              <div className="flex items-center mb-4">
                <input 
                  type="checkbox" 
                  id="disabledCheckbox"
                  className="mr-2"
                />
                <label htmlFor="disabledCheckbox" className="text-gray-700 text-xs dark:text-gray-300"> Disabled
                </label>
              </div>
          
          <div className="mb-4">
            <label className="block mb-2">Article description</label>
            <div className="border border-gray-700 rounded">
              {/* Rich Text Editor Menu */}
              <div className="dark:bg-gray-800 border-b border-gray-700 p-2">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {/* File Menu */}
                    <button className="px-2 py-1 text-sm text-gray-400 hover:bg-gray-700 rounded">File</button>
                    <button className="px-2 py-1 text-sm text-gray-400 hover:bg-gray-700 rounded">Edit</button>
                    <button className="px-2 py-1 text-sm text-gray-400 hover:bg-gray-700 rounded">View</button>
                    <button className="px-2 py-1 text-sm text-gray-400 hover:bg-gray-700 rounded">Insert</button>
                    <button className="px-2 py-1 text-sm text-gray-400 hover:bg-gray-700 rounded">Format</button>
                    <button className="px-2 py-1 text-sm text-gray-400 hover:bg-gray-700 rounded">Tools</button>
                    <button className="px-2 py-1 text-sm text-gray-400 hover:bg-gray-700 rounded">Table</button>
                  </div>
                </div>
                
                {/* Formatting Toolbar */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="relative">
                    <select className="dark:bg-gray-700 border border-gray-600 rounded p-1 text-gray-400 dark:text-white appearance-none pl-2 pr-8 text-sm">
                      <option>System Font</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronDown size={16} className="text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="relative">
                    <select className="dark:bg-gray-700 border border-gray-600 rounded p-1 text-gray-400 dark:text-white appearance-none pl-2 pr-8 text-sm">
                      <option>12pt</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronDown size={16} className="text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="mx-1 text-gray-500">|</div>
                  
                  <button className="p-1 text-gray-400 hover:bg-gray-700 rounded">
                    <Bold size={16} />
                  </button>
                  
                  <button className="p-1 text-gray-400 hover:bg-gray-700 rounded">
                    <Italic size={16} />
                  </button>
                  
                  <div className="mx-1 text-gray-500">|</div>
                  
                  <button className="p-1 text-gray-400 hover:bg-gray-700 rounded">
                    <AlignLeft size={16} />
                  </button>
                  
                  <button className="p-1 text-gray-400 hover:bg-gray-700 rounded">
                    <AlignCenter size={16} />
                  </button>
                  
                  <button className="p-1 text-gray-400 hover:bg-gray-700 rounded">
                    <AlignRight size={16} />
                  </button>
                  
                  <button className="p-1 text-gray-400 hover:bg-gray-700 rounded">
                    <List size={16} />
                  </button>
                  
                  <div className="mx-1 text-gray-500">|</div>
                  
                  <button className="p-1 text-gray-400 hover:bg-gray-700 rounded">
                    <Image size={16} />
                  </button>
                  
                  <button className="p-1 text-gray-400 hover:bg-gray-700 rounded">
                    <Link2 size={16} />
                  </button>
                  
                  <button className="p-1 text-gray-400 hover:bg-gray-700 rounded">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </div>
              
              {/* Editor Content Area */}
              <div className="min-h-40 p-2 text-white">
                {/* Content goes here */}
              </div>
            </div>
          </div>
        
            </div>            
          
          <div className="flex justify-end gap-2 dark:border-t border-gray-700 pt-4 mt-6">
            <button 
              type="button"
              onClick={() => setShowNewArticleModal(false)} 
              className="px-4 py-2 text-white rounded hover:bg-gray-700 bg-gray-600"
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={handleAddNewArticle}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >Save
            </button>
          </div>
        </div>
      </div>
       {/* New Group Modal */}
      {showNewGroupModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="dark:bg-gray-800 bg-white rounded-lg w-full max-w-md overflow-hidden">
            <div className="bg-blue-500 p-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">New Group</h3>
              <button 
                onClick={() => setShowNewGroupModal(false)}
                className="text-white hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block mb-2 text-sm text-gray-400">
                  <span className="text-red-500 mr-1">*</span> Group Name
                </label>
                <input 
                  type="text" 
                  className="w-full dark:bg-gray-900 border border-gray-700 rounded p-2 text-gray-400 dark:text-white"
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-2 text-sm text-gray-400">Color</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={groupColor}
                    onChange={(e) => setGroupColor(e.target.value)}
                    className="flex-1 dark:bg-gray-700  border border-gray-600 rounded p-2 text-gray-400 dark:text-white"
                  />
                  <div className="ml-2 w-6 h-6 border border-gray-400 rounded">
                    <input
                      type="color"
                      value={groupColor}
                      onChange={(e) => setGroupColor(e.target.value)}
                      className="w-full h-full cursor-pointer opacity-0"
                    />
                    <div 
                      className="w-full h-full -mt-6" 
                      style={{ backgroundColor: groupColor }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block mb-2 text-sm text-gray-400">Short description</label>
                <div className="border border-gray-700 rounded">
                  {/* Rich Text Editor Menu */}
                  <div className="dark:bg-gray-800 border-b border-gray-700 p-2">
                    <div className="flex items-center gap-2">
                      <button className="px-2 py-1 text-sm text-gray-400 hover:bg-gray-700 rounded">File</button>
                      <button className="px-2 py-1 text-sm text-gray-400 hover:bg-gray-700 rounded">Edit</button>
                      <button className="px-2 py-1 text-sm text-gray-400 hover:bg-gray-700 rounded">View</button>
                      <button className="px-2 py-1 text-sm text-gray-400 hover:bg-gray-700 rounded">Insert</button>
                      <button className="px-2 py-1 text-sm text-gray-400 hover:bg-gray-700 rounded">Format</button>
                      <button className="px-2 py-1 text-sm text-gray-400 hover:bg-gray-700 rounded">Tools</button>
                      <button className="px-2 py-1 text-sm text-gray-400 hover:bg-gray-700 rounded">Table</button>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <div className="relative">
                        <select className="dark:bg-gray-700 border border-gray-600 rounded p-1 text-gray-400 dark:text-white appearance-none pl-2 pr-8 text-sm">
                          <option>System Font</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <ChevronDown size={16} className="text-gray-400" />
                        </div>
                      </div>
                      
                      <div className="relative">
                        <select className="dark:bg-gray-700 border border-gray-600 rounded p-1 text-gray-400 dark:text-white appearance-none pl-2 pr-8 text-sm">
                          <option>12pt</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <ChevronDown size={16} className="text-gray-400" />
                        </div>
                      </div>
                      
                      <button className="p-1 text-gray-400 hover:bg-gray-700 rounded">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Editor Content Area */}
                  <div className="min-h-32 p-2 text-white">
                    {/* Content goes here */}
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block mb-2 text-sm text-gray-400">Order</label>
                <input 
                  type="number" 
                  className="w-full dark:bg-gray-900 border border-gray-700 rounded p-2 text-gray-400 dark:text-white"
                  defaultValue="1"
                />
              </div>
              
              <div className="mb-4">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="disabledGroup"
                    className="mr-2"
                  />
                  <label htmlFor="disabledGroup" className="text-gray-400">Disabled</label>
                </div>
                <p className="text-xs text-gray-500 mt-1">Note: All articles in this group will be hidden if disabled is checked</p>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button 
                  onClick={() => setShowNewGroupModal(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                >
                  Close
                </button>
                <button 
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
        )
      }

    </div>

  )
}