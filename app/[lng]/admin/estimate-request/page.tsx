'use client'
import { ArrowUpDown, ChevronDown, Plus, RotateCw, Search, X } from 'lucide-react'
import { useState, useEffect } from 'react'


// Define TypeScript interfaces for our data
interface Estimate {
  id: number;
  email: string;
  tags: string;
  assigned: string;
  status: 'Cancelled' | 'Processing' | 'Completed';
  created: string;
}

interface SortConfig {
  key: keyof Estimate | null;
  direction: 'ascending' | 'descending' | null;
}

// Initial dummy data - empty to match the image
const dummyEstimates: Estimate[] = [];

export default function EstimateRequest() {
  // const [estimates, setEstimates] = useState<Estimate[]>(dummyEstimates);
  const [filteredEstimates, setFilteredEstimates] = useState<Estimate[]>(dummyEstimates);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: null });
  const [showNewEstimateModal, setShowNewEstimateModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState('general');
  const [submitText, setSubmitText] = useState('Submit');
  const [buttonBgColor, setButtonBgColor] = useState('#84c529');
  const [buttonTextColor, setButtonTextColor] = useState('#ffffff');
   const [submissionAction, setSubmissionAction] = useState('thankYou');
  const [thankYouMessage, setThankYouMessage] = useState('');
  const [notifyOnSubmit, setNotifyOnSubmit] = useState(true);
  const [notificationTarget, setNotificationTarget] = useState('specificStaff');
  

  // Select/deselect all rows
  useEffect(() => {
    if (selectAll) {
      setSelectedRows(filteredEstimates.map(subscription => subscription.id));
    } else {
      setSelectedRows([]);
    }
  }, [selectAll, filteredEstimates]);

  // Handle row selection
  const toggleRowSelection = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Handle column sorting
  const requestSort = (key: keyof Estimate | null) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    // Apply sorting
    const sortedItems = [...filteredEstimates].sort((a, b) => {
      if (!key) return 0;
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setFilteredEstimates(sortedItems);
  };

  
  const handleAddNewEstimate = (e: React.FormEvent) => {
      e.preventDefault();
      // Implementation would go here
      setShowNewEstimateModal(false);
    };

  return (
    <div className="flex-1 dark:bg-gray-900 bg-white min-h-screen flex flex-col text-indigo-600 overflow-x-hidden dark:text-gray-100">
      
      {/* Action buttons */}
      <div className="flex justify-between p-6 pb-4">
        <button onClick={() => setShowNewEstimateModal(true)} className="flex items-center justify-between text-sm px-3 py-2 cursor-pointer rounded-lg bg-blue-500 text-white hover:bg-blue-600">
          <Plus size={14} className="mr-2" /> New Form
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
                <th className="p-4 text-sm font-medium text-gray-400 cursor-pointer" onClick={() => requestSort('email')}>
                  <div className="flex items-center">
                    Email <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-4 text-sm font-medium text-gray-400 cursor-pointer" onClick={() => requestSort('tags')}>
                  <div className="flex items-center">
                    Tags <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-4 text-sm font-medium text-gray-400 cursor-pointer" onClick={() => requestSort('assigned')}>
                  <div className="flex items-center">
                    Assigned <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-4 text-sm font-medium text-gray-400 cursor-pointer" onClick={() => requestSort('status')}>
                  <div className="flex items-center">
                    Status <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-4 text-sm font-medium text-gray-400 cursor-pointer" onClick={() => requestSort('created')}>
                  <div className="flex items-center">
                    Created <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredEstimates.length > 0 ? (
                filteredEstimates.map((subscription) => (
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
                    <td className="p-4 text-gray-300">{subscription.email}</td>
                    <td className="p-4 text-gray-300">{subscription.tags}</td>
                    <td className="p-4 text-gray-300">{subscription.assigned}</td>
                    <td className="p-4 text-gray-300">
                      {subscription.status}
                    </td>
                    <td className="p-4 text-gray-300">{subscription.created}</td>
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
    
      {showNewEstimateModal &&
      (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="dark:bg-gray-800 bg-white border border-gray-700 rounded-lg w-full max-w-[50rem] max-h-[90vh] overflow-y-auto">
        <div className='bg-blue-200 p-4 border-b border-gray-700'>
          <p className='text-sm text-blue-800'>Create form first to be able to use the form builder.</p>
        </div>
        <div className="flex justify-between items-center bg-gray-800 mb-2 p-3 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">New Form</h2>
          <button 
            onClick={() => setShowNewEstimateModal(false)} 
            className="text-gray-400 hover:text-white"
          >
            <X size={20} color='#fff' />
          </button>
        </div>

        <div className="dark:bg-gray-700 bg-gray-200 px-4 py-0 rounded-md mx-12 mt-6">
          <div className="flex">
            <button
              className={`py-2 px-4 text-sm ${activeTab === 'general' ? 'dark:text-white text-gray-700 border-b-2 border-blue-500' : 'text-gray-400'}`}
              onClick={() => setActiveTab('general')}
            >
              General
            </button>
            <button
              className={`py-2 px-4 text-sm ${activeTab === 'branding' ? 'dark:text-white text-gray-700 border-b-2 border-blue-500' : 'text-gray-400'}`}
              onClick={() => setActiveTab('branding')}
            >
              Branding
            </button>
            <button
              className={`py-2 px-4 text-sm ${activeTab === 'solution' ? 'dark:text-white text-gray-700 border-b-2 border-blue-500' : 'text-gray-400'}`}
              onClick={() => setActiveTab('solution')}
            >
              Solution
            </button>
            <button
              className={`py-2 px-4 text-sm ${activeTab === 'notifications' ? 'dark:text-white text-gray-700 border-b-2 border-blue-500' : 'text-gray-400'}`}
              onClick={() => setActiveTab('notifications')}
            >
              Notifications
            </button>
          </div>
        </div>
        
        <div className="p-6 dark:bg-gray-800 bg-white">
          {activeTab == 'general' && (
            <div>
              <div className="mb-4">
                <label className="flex mb-1 text-sm text-gray-400">
                  <span className="text-red-500 mr-1">*</span> Form Name
                </label>
                <input 
                  type="url" 
                  className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 dark:text-white text-gray-400"
                />
              </div>
              
              <div className="mb-4">
                <label className="flex mb-1 text-sm text-gray-400">
                 <span className="text-red-500 mr-1">*</span>? Language
                </label>
                <div className="relative">
                  <select className="w-full dark:bg-gray-700 text-sm bg-white border border-gray-600 rounded p-2 dark:text-white text-gray-500 appearance-none">
                    <option>English</option>
                    <option>Lithuanian</option>
                    <option>Francais</option>
                    <option>Italiano</option>
                    <option>Deutsch</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown size={12} className="text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label className="flex mb-1 text-sm text-gray-400">
                 <span className="text-red-500 mr-1">*</span> Status
                </label>
                <div className="relative">
                  <select className="w-full dark:bg-gray-700 text-sm bg-white border border-gray-600 rounded p-2 dark:text-white text-gray-500 appearance-none">
                    <option>Processing</option>
                    <option>Cancelled</option>
                    <option>Completed</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown size={12} className="text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label className="flex mb-1 text-sm text-gray-400">
                 <span className="text-red-500 mr-1">*</span> Responsible (Asignee)
                </label>
                <div className="relative">
                  <select className="w-full dark:bg-gray-700 text-sm bg-white border border-gray-600 rounded p-2 dark:text-white text-gray-500 appearance-none">
                    <option>Zygimantas P.</option>
                    <option>Paul P.</option>
                    <option>Abraham A.</option>
                    <option>Patrick R.</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown size={12} className="text-gray-400" />
                  </div>
                </div>
              </div>
            </div>            
          )}

          {activeTab == 'branding' && (
            <div>
              <div className="mb-4">
                <label  className="flex mb-1 text-sm text-gray-400">
                  <span className="text-red-500 mr-1">*</span> Submit button text
                </label>
                <input 
                  type="text"
                  value={submitText}
                  onChange={(e) => setSubmitText(e.target.value)}
                  className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 dark:text-white text-gray-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Button Background Color */}
              <div>
                <label className="block mb-1 text-sm text-gray-400">
                  Submit button background color
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={buttonBgColor}
                    onChange={(e) => setButtonBgColor(e.target.value)}
                    className="flex-1 dark:bg-gray-700 border border-gray-600 rounded p-2 text-gray-400 dark:text-white"
                  />
                  <div className="ml-2 w-6 h-6 border border-gray-400 rounded">
                    <input
                      type="color"
                      value={buttonBgColor}
                      onChange={(e) => setButtonBgColor(e.target.value)}
                      className="w-full h-full cursor-pointer opacity-0"
                    />
                    <div 
                      className="w-full h-full -mt-6" 
                      style={{ backgroundColor: buttonBgColor }}
                    />
                  </div>
                </div>
              </div>

              {/* Button Text Color */}
              <div>
                <label className="block mb-1 text-sm text-gray-400">
                  Submit button background text
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={buttonTextColor}
                    onChange={(e) => setButtonTextColor(e.target.value)}
                    className="flex-1 dark:bg-gray-700  border border-gray-600 rounded p-2 text-gray-400 dark:text-white"
                  />
                  <div className="ml-2 w-6 h-6 border border-gray-400 rounded">
                    <input
                      type="color"
                      value={buttonTextColor}
                      onChange={(e) => setButtonTextColor(e.target.value)}
                      className="w-full h-full cursor-pointer opacity-0"
                    />
                    <div 
                      className="w-full h-full -mt-6" 
                      style={{ backgroundColor: buttonTextColor }}
                    />
                  </div>
                </div>
              </div>
              </div>
            </div>            
          )}
          {activeTab == 'solution' && (
            <div className="space-y-6 text-sm">
            <div className="text-gray-400 mb-4">
              What should happen after a visitor submits this form?
            </div>
            
            {/* Radio Buttons for Submission Action */}
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="submissionAction"
                  checked={submissionAction === 'thankYou'}
                  onChange={() => setSubmissionAction('thankYou')}
                  className="form-radio h-5 w-5 text-blue-400 bg-gray-700 border-gray-600"
                />
                <span className="ml-2 text-gray-400">Display thank you message</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  name="submissionAction"
                  checked={submissionAction === 'redirect'}
                  onChange={() => setSubmissionAction('redirect')}
                  className="form-radio h-5 w-5 text-blue-400 bg-gray-700 border-gray-600"
                />
                <span className="ml-2 text-gray-400">Redirect to another website</span>
              </label>
            </div>
            
            {/* Thank You Message Field */}
            <div>
              <label className="flex mb-1 text-sm text-gray-400">
                <span className="text-red-500 mr-1">*</span> Message to show after form is successfully submitted
              </label>
              <textarea
                value={thankYouMessage}
                onChange={(e) => setThankYouMessage(e.target.value)}
                className="w-full dark:bg-gray-700 border border-gray-600 rounded p-2 text-gray-400 dark:text-white min-h-32"
              />
            </div>
          </div>            
          )}

          {/* Notifications Tab Content */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 text-sm">
            <div className="mb-4 text-gray-400">Notification settings</div>
            
            {/* Notify Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifyOnSubmit"
                checked={notifyOnSubmit}
                onChange={(e) => setNotifyOnSubmit(e.target.checked)}
                className="h-5 w-5 text-blue-400 bg-gray-700 border-gray-600 rounded"
              />
              <label htmlFor="notifyOnSubmit" className="ml-2 text-gray-400">
                Notify when estimate request submitted
              </label>
            </div>
            
            {/* Notification Target Radio Buttons */}
            {notifyOnSubmit && (
              <div className="space-y-3 flex items-center gap-2 mt-4 text-sm">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="notificationTarget"
                    checked={notificationTarget === 'specificStaff'}
                    onChange={() => setNotificationTarget('specificStaff')}
                    className="form-radio h-5 w-5 text-blue-400 bg-gray-700 border-gray-600"
                  />
                  <span className="ml-2 text-gray-400">Specific Staff Members</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="notificationTarget"
                    checked={notificationTarget === 'staffRoles'}
                    onChange={() => setNotificationTarget('staffRoles')}
                    className="form-radio h-5 w-5 text-blue-400 bg-gray-700 border-gray-600"
                  />
                  <span className="ml-2 text-gray-400">Staff members with roles</span>
                </label>
                
                <label className="flex items-center -mt-3">
                  <input
                    type="radio"
                    name="notificationTarget"
                    checked={notificationTarget === 'responsiblePerson'}
                    onChange={() => setNotificationTarget('responsiblePerson')}
                    className="form-radio h-5 w-5 text-blue-400 bg-gray-700 border-gray-600"
                  />
                  <span className="ml-2 text-gray-400">Responsible person</span>
                </label>
              </div>
            )}
            
            {/* Staff Members Dropdown */}
            {notifyOnSubmit && notificationTarget === 'specificStaff' && (
              <div>
                <label className="block mb-1 text-sm text-gray-400">
                  Staff Members to Notify
                </label>
                <div className="relative text-sm">
                  <select
                    className="w-full dark:bg-gray-700 border border-gray-600 rounded p-2 text-gray-400 appearance-none"
                  >
                    <option>Nothing selected</option>
                    <option>Zygimantas P.</option>
                    <option>Paul P.</option>
                    <option>Abraham A.</option>
                    <option>Patrick R.</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

          
          <div className="flex justify-end gap-2 dark:border-t border-gray-700 pt-4 mt-6">
            <button 
              type="button"
              onClick={() => setShowNewEstimateModal(false)} 
              className="px-4 py-2 text-white rounded hover:bg-gray-700 bg-gray-600"
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={handleAddNewEstimate}
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