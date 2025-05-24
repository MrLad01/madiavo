import React, { useState } from 'react';
import { X, User, FileText, CheckSquare, Paperclip, Bell, Activity, Printer, Edit, MoreVertical, Check, Trash2, ChevronDown, Tag, EyeOff, Eye } from 'lucide-react';

interface LeadModalProps {
  showLeadModal: boolean;
  setShowLeadModal: (show: boolean) => void;
  mode: 'view' | 'edit'
}

const LeadModal: React.FC<LeadModalProps> = ({ showLeadModal, setShowLeadModal, mode }) => {

    const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica",
  "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
  "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon",
  "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel",
  "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos",
  "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi",
  "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova",
  "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands",
  "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau",
  "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania",
  "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal",
  "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea",
  "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan",
  "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela",
  "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];
  const [activeTab, setActiveTab] = useState('profile');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [toCustomerModal, setToCustomerModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');
   const [formData, setFormData] = useState({
    firstName: 'Test',
    lastName: '',
    position: '',
    email: '',
    company: '',
    phone: '',
    website: '',
    address: '',
    city: '',
    state: '',
    country: 'Lithuania',
    zipCode: '',
    password: '',
    sendSetPasswordEmail: false,
    doNotSendWelcomeEmail: true
  });

  const handleAddNewLead = (e: React.FormEvent) => {
      e.preventDefault();
      // Implementation would go here
    };

     const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'proposals', label: 'Proposals', icon: FileText },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'attachments', label: 'Attachments', icon: Paperclip },
    { id: 'reminders', label: 'Reminders', icon: Bell },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'activity', label: 'Activity Log', icon: Activity },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleConvertToCustomer = () => {
    // Add your conversion logic here
    console.log('Converting to customer...');
  };

  if (!showLeadModal) return null;

    function setIsDragOver(arg0: boolean) {
        throw new Error('Function not implemented.');
    }

    function handleFileUpload(files: File[]) {
        throw new Error('Function not implemented.');
    }

    function removeFil(index: any): void {
        throw new Error('Function not implemented.');
    }

  return (
    <>
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="dark:bg-gray-800 bg-white border border-gray-700 rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center bg-blue-400 p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">#5 - Test</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrint}
              className="text-white hover:text-gray-200 p-1"
              title="Print"
            >
              <Printer size={16} />
            </button>
            <button 
              onClick={() => setShowLeadModal(false)} 
              className="text-white hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="dark:bg-gray-800 text-sm ">
          <div className="flex mx-16 rounded-lg ">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'dark:text-white text-gray-400 border-blue-400 dark:bg-gray-800'
                      : 'text-gray-400 border-transparent hover:text-gray-300'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto dark:bg-gray-900 text-sm">
        {activeTab === 'profile' && (
  <>
    {modalMode === 'view' ? (
      <div className="p-6">
        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mb-6">
          <button 
            onClick={() => setToCustomerModal(true)}
            className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
          >
            <User size={16} />
            Convert to customer
          </button>
          
          <button 
            onClick={() => setModalMode('edit')} 
            className="dark:bg-gray-700 bg-gray-400 dark:hover:bg-gray-600 text-white px-3 py-2 rounded-lg flex items-center gap-2"
          >
            <Edit size={16} />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="flex items-center gap-2 text-sm dark:bg-gray-700 bg-gray-400 dark:hover:bg-gray-600 text-white p-2 rounded-lg"
            >
              More
              <ChevronDown size={14} />
            </button>
            {showMoreMenu && (
              <div className="absolute right-0 top-full mt-1 dark:bg-gray-800 bg-gray-400 border border-gray-600 rounded-lg shadow-lg py-1 min-w-[160px] z-10">
                <button className="flex items-center gap-2 px-3 py-2 text-sm dark:text-gray-300 text-white hover:bg-gray-700 w-full text-left">
                  <Check size={14} />
                  Mark as lost
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-sm dark:text-gray-300 text-white hover:bg-gray-700 w-full text-left">
                  <X size={14} />
                  Mark as junk
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-gray-700 w-full text-left">
                  <Trash2 size={14} />
                  Delete Lead
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Lead Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lead Information Column */}
          <div className="dark:bg-gray-800 rounded-lg p-4 border-gray-600 border">
            <h3 className="dark:bg-white w-full rounded-md p-2 text-gray-700 font-semibold mb-4 border-b border-gray-700">Lead Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-gray-400 text-sm">Name</label>
                <p className="dark:text-white text-gray-500">Test</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Position</label>
                <p className="dark:text-white text-gray-500">-</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Email Address</label>
                <p className="dark:text-white text-gray-500">-</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Website</label>
                <p className="dark:text-white text-gray-500">-</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Phone</label>
                <p className="dark:text-white text-gray-500">-</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Lead value</label>
                <p className="dark:text-white text-gray-500">-</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Company</label>
                <p className="dark:text-white text-gray-500">-</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Address</label>
                <p className="dark:text-white">-</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">City</label>
                <p className="dark:text-white text-gray-500">-</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">State</label>
                <p className="dark:text-white text-gray-500">-</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Country</label>
                <p className="dark:text-white text-gray-500">Lithuania</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Zip Code</label>
                <p className="dark:text-white text-gray-500">-</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Description</label>
                <p className="dark:text-white text-gray-500">-</p>
              </div>
            </div>
          </div>

          {/* General Information Column */}
          <div className="dark:bg-gray-800 rounded-lg p-4 border-gray-600 border">
            <h3 className="dark:bg-white w-full rounded-md p-2 text-gray-700 font-semibold mb-4 border-b border-gray-700">General Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-1">
                <label className="text-gray-400 text-sm">Status</label>
                <span className="inline-block bg-blue-200 text-blue-600 px-2 py-1 rounded text-xs font-medium mt-1">
                  New
                </span>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Source</label>
                <p className="dark:text-white text-gray-500">Google</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Default Language</label>
                <p className="dark:text-white text-gray-500">System Default</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Assigned</label>
                <p className="dark:text-white text-gray-500">Paulius P.</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Tags</label>
                <p className="dark:text-white text-gray-500">-</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Created</label>
                <p className="dark:text-white text-gray-500">4 weeks ago</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Last Contact</label>
                <p className="dark:text-white text-gray-500">4 weeks ago</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Public</label>
                <p className="dark:text-white text-gray-500">No</p>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Activity */}
        <div className="mt-6 dark:bg-gray-800 text-gray-500 rounded-lg p-4 border border-gray-600">
          <h3 className="dark:text-white font-semibold mb-4 border-b border-gray-700 pb-2">Latest Activity</h3>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <User size={16} className="text-gray-300" />
            </div>
            <div>
              <p className="dark:text-white text-sm">
                <span className="font-medium">Paulius P.</span> - created lead
              </p>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="dark:bg-gray-800 bg-white border border-gray-700 rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header with Save and Cancel buttons */}
            <div className="flex justify-end gap-2 mb-6">
          <button 
            onClick={() => setToCustomerModal(true)}
            className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
          >
            <User size={16} />
            Convert to customer
          </button>
          
          <button 
            onClick={() => setModalMode('view')} 
            className="dark:bg-gray-700 bg-gray-400 dark:hover:bg-gray-600 text-white px-3 py-2 rounded-lg flex items-center gap-2"
          >
            <Edit size={16} />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="flex items-center gap-2 text-sm dark:bg-gray-700 bg-gray-400 dark:hover:bg-gray-600 text-white p-2 rounded-lg"
            >
              More
              <ChevronDown size={14} />
            </button>
            {showMoreMenu && (
              <div className="absolute right-0 top-full mt-1 dark:bg-gray-800 bg-gray-400 border border-gray-600 rounded-lg shadow-lg py-1 min-w-[160px] z-10">
                <button className="flex items-center gap-2 px-3 py-2 text-sm dark:text-gray-300 text-white hover:bg-gray-700 w-full text-left">
                  <Check size={14} />
                  Mark as lost
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-sm dark:text-gray-300 text-white hover:bg-gray-700 w-full text-left">
                  <X size={14} />
                  Mark as junk
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-gray-700 w-full text-left">
                  <Trash2 size={14} />
                  Delete Lead
                </button>
              </div>
            )}
          </div>
        </div>

          <form onSubmit={handleAddNewLead}>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block mb-1 text-xs text-gray-400">
                  <span className="text-red-500">*</span> Status
                </label>
                <div className="relative">
                  <select className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600">
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
                  <select className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600">
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
              
              <div>
                <label className="block mb-1 text-xs text-gray-400">
                  Assigned
                </label>
                <div className="relative">
                  <select className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600">
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
              <label className="mb-1 text-xs text-gray-400 flex items-center gap-1.5">
                <Tag size={14} />
                Tags
              </label>
              <input 
                type="text" 
                placeholder="Tag" 
                className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600"
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
                  defaultValue="Test"
                  className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-xs text-gray-400">
                  Address
                </label>
                <input 
                  type="text" 
                  className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600"
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
                  className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-xs text-gray-400">
                  City
                </label>
                <input 
                  type="text" 
                  className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600"
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
                  className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-xs text-gray-400">
                  State
                </label>
                <input 
                  type="text" 
                  className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600"
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
                  className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-xs text-gray-400">
                  Country
                </label>
                <div className="relative">
                  <select className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600">
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
                  className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-xs text-gray-400">
                  Zip Code
                </label>
                <input 
                  type="text" 
                  className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600"
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
                    className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 pl-6 dark:text-white text-gray-600"
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400">$</span>
                </div>
              </div>
              
              <div>
                <label className="block mb-1 text-xs text-gray-400">
                  Default Language
                </label>
                <div className="relative">
                  <select className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600">
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
                className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-1 text-xs text-gray-400">
                Description
              </label>
              <textarea 
                className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600 h-24"
              />
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="publicCheckbox"
                  className="mr-2"
                />
                <label htmlFor="publicCheckbox" className="dark:text-gray-300 text-gray-600">Public</label>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="contactedToday"
                  className="mr-2"
                  defaultChecked
                />
                <label htmlFor="contactedToday" className="dark:text-gray-300 text-gray-600">Contacted Today</label>
              </div>
              <div className="flex gap-2">
              <button 
                onClick={() => setModalMode('view')}
                className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Save
              </button>
              <button 
                onClick={() => setModalMode('view')}
                className="dark:bg-gray-700 bg-gray-400 dark:hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Cancel
              </button>
            </div>
            </div>
          </form>
        </div>
      </div>
    )}
  </>
)}

          {activeTab === 'tasks' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <button className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                  + New Task
                </button>
                <button className="dark:bg-gray-700 dark:hover:bg-gray-600 bg-gray-50 text-gray-400 dark:text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                  </svg>
                  Filters
                </button>
              </div>

              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <select className="dark:bg-gray-800 bg-gray-50 text-gray-400 border border-gray-600 rounded px-3 py-2 dark:text-white text-sm">
                    <option>25</option>
                    <option>50</option>
                    <option>100</option>
                  </select>
                  <button className="dark:bg-gray-800 bg-gray-50 text-gray-400  dark:hover:bg-gray-600 dark:text-white px-3 py-2 rounded text-sm">Export</button>
                  <button className="dark:bg-gray-800 bg-gray-50 text-gray-400  dark:hover:bg-gray-600 dark:text-white px-3 py-2 rounded text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="dark:bg-gray-800 border bg-gray-50 text-gray-400 border-gray-600 rounded-lg pl-10 pr-4 py-2 dark:text-white text-sm w-80"
                  />
                  <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              <div className="dark:bg-gray-800 bg-gray-50 rounded-lg overflow-hidden">
                <div className="grid grid-cols-7 gap-4 p-4 border-b border-gray-700 text-gray-400 text-sm font-medium">
                  <div className="flex items-center gap-2">
                    # <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                  <div className="flex items-center gap-2">
                    Name <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                  <div className="flex items-center gap-2">
                    Status <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                  <div className="flex items-center gap-2">
                    Start Date <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                  <div className="flex items-center gap-2">
                    Due Date <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                  </div>
                  <div className="flex items-center gap-2">
                    Assigned to <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                  <div className="flex items-center gap-2">
                    Priority <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 mb-4 text-blue-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="dark:text-white text-gray-500 text-lg">No entries found</p>
                <div className="mt-4 space-y-2">
                  <div className="h-1 w-32 bg-blue-600 rounded"></div>
                  <div className="h-1 w-24 bg-blue-600 rounded"></div>
                  <div className="h-1 w-40 bg-blue-600 rounded"></div>
                  <div className="h-1 w-36 bg-blue-600 rounded"></div>
                </div>
              </div>
            </div>
          )}

        {activeTab === 'attachments' && (
        <div className="p-6">
            <div 
            className={`border-2 border-dashed rounded-lg p-20 text-center transition-colors border-blue-500`}
            onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
            }}
            onDragLeave={(e) => {
                e.preventDefault();
                setIsDragOver(false);
            }}
            onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                const files = Array.from(e.dataTransfer.files);
                handleFileUpload(files);
            }}
            onClick={() => fileInputRef.current?.click()}
            >
            <p className="text-blue-400 text-lg mb-4">Drop files here to upload</p>
            <p className="text-gray-400 text-sm">or click to browse files</p>
            <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                const files = Array.from(e.target.files || []);
                handleFileUpload(files);
                }}
            />
            </div>
            
            {uploadedFiles.length > 0 && (
            <div className="mt-6">
                <h3 className="text-white text-lg mb-4">Uploaded Files</h3>
                <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                            {file.name.split('.').pop()?.toUpperCase() || 'FILE'}
                        </span>
                        </div>
                        <div>
                        <p className="text-white text-sm">{file.name}</p>
                        <p className="text-gray-400 text-xs">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        </div>
                    </div>
                    <button
                        onClick={() => removeFil(index)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                    >
                        ×
                    </button>
                    </div>
                ))}
                </div>
            </div>
            )}
        </div>
        )}

          {/* Reminders Tab */}
          {activeTab === 'reminders' && (
            <div className="p-6">
              <div className="mb-6">
                <button className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                  <Bell size={16} />
                  Set Lead Reminder
                </button>
              </div>

              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <select className="dark:bg-gray-800 bg-gray-50 text-gray-400 border border-gray-600 rounded px-3 py-2 dark:text-white text-sm">
                    <option>25</option>
                    <option>50</option>
                    <option>100</option>
                  </select>
                  <button className="dark:bg-gray-700 dark:hover:bg-gray-600  bg-gray-50 text-gray-400 dark:text-white px-3 py-2 rounded text-sm">Export</button>
                  <button className="dark:bg-gray-700 dark:hover:bg-gray-600  bg-gray-50 text-gray-400 dark:text-white px-3 py-2 rounded text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="dark:bg-gray-800 border bg-gray-50 text-gray-400 border-gray-600 rounded-lg pl-10 pr-4 py-2 dark:text-white text-sm w-80"
                  />
                  <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              <div className="dark:bg-gray-800 rounded-lg overflow-hidden">
                <div className="grid grid-cols-4 gap-4 p-4 border-b border-gray-700 text-gray-400 text-sm font-medium">
                  <div className="flex items-center gap-2">
                    Description <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                  <div className="flex items-center gap-2">
                    Date <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                  </div>
                  <div className="flex items-center gap-2">
                    Remind <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                  <div className="flex items-center gap-2">
                    Is notified? <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 mb-4 text-blue-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="dark:text-white text-gray-400 text-lg">No entries found</p>
                <div className="mt-4 space-y-2">
                  <div className="h-1 w-32 bg-blue-600 rounded"></div>
                  <div className="h-1 w-24 bg-blue-600 rounded"></div>
                  <div className="h-1 w-40 bg-blue-600 rounded"></div>
                  <div className="h-1 w-36 bg-blue-600 rounded"></div>
                </div>
              </div>
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div className="p-6">
              <div className="dark:bg-gray-800 rounded-lg p-6">
                <textarea
                  placeholder=""
                  className="w-full h-32 dark:text-white bg-transparent text-gray-400 placeholder-gray-400 resize-none border border-gray-400 rounded-lg outline-none"
                />
                <div className="mt-4 space-y-3">
                  <label className="flex items-center gap-3 text-gray-400">
                    <input type="radio" name="contact" className="text-blue-600" />
                    <span>I got in touch with this lead</span>
                  </label>
                  <label className="flex items-center gap-3 text-gray-400">
                    <input type="radio" name="contact" className="text-blue-600" defaultChecked />
                    <span>I have not contacted this lead</span>
                  </label>
                </div>
                <div className="flex justify-end mt-6">
                  <button className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-medium">
                    Add Note
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Activity Log Tab */}
          {activeTab === 'activity' && (
            <div className="p-6">
              <div className="bg-white rounded-lg p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-gray-500 text-sm font-medium">4 WEEKS AGO</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User size={16} className="text-gray-600" />
                  </div>
                  <span className="text-gray-800">
                    <strong>Paulius P.</strong> - created lead
                  </span>
                </div>
              </div>

              <div className="dark:bg-gray-800 rounded-lg p-2">
                <textarea
                  placeholder="Enter Activity"
                  className="w-full h-24 bg-transparent text-gray-400 placeholder-gray-500 resize-none border rounded-lg p-2 outline-none"
                />
                <div className="flex justify-end mt-4">
                  <button className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-medium">
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Proposals Tab */}
          {activeTab === 'proposals' && (
            <div className="p-6">
              <div className="mb-6">
                <button className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  New Proposal
                </button>
              </div>

              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <select className="dark:bg-gray-800 bg-gray-50 text-gray-400 border border-gray-600 rounded px-3 py-2 dark:text-white text-sm">
                    <option>25</option>
                    <option>50</option>
                    <option>100</option>
                  </select>
                  <button className="dark:bg-gray-700 bg-gray-50 text-gray-400 dark:hover:bg-gray-600 dark:text-white px-3 py-2 rounded text-sm">Export</button>
                  <button className="dark:bg-gray-700 bg-gray-50 text-gray-400 dark:hover:bg-gray-600 dark:text-white px-3 py-2 rounded text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="dark:bg-gray-800 border bg-gray-50 text-gray-400 border-gray-600 rounded-lg pl-10 pr-4 py-2 dark:text-white text-sm w-80"
                  />
                  <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              <div className="dark:bg-gray-800 bg-gray-50 rounded-lg overflow-hidden">
                <div className="grid grid-cols-8 gap-4 p-4 border-b border-gray-700 text-gray-400 text-sm font-medium">
                  <div className="flex items-center gap-2">
                    Proposal # <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                  <div className="flex items-center gap-2">
                    Subject <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                  <div className="flex items-center gap-2">
                    Total <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                  <div className="flex items-center gap-2">
                    Date <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                  <div className="flex items-center gap-2">
                    Open Till <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                  <div className="flex items-center gap-2">
                    Tags <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                  <div className="flex items-center gap-2">
                    Date Created <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                  <div className="flex items-center gap-2">
                    Status <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 mb-4 text-blue-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="dark:text-white text-gray-400 text-lg">No entries found</p>
                <div className="mt-4 space-y-2">
                  <div className="h-1 w-32 bg-blue-600 rounded"></div>
                  <div className="h-1 w-24 bg-blue-600 rounded"></div>
                  <div className="h-1 w-40 bg-blue-600 rounded"></div>
                  <div className="h-1 w-36 bg-blue-600 rounded"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
      {toCustomerModal && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
          <div className="dark:bg-gray-800 bg-white border border-gray-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center bg-blue-400 p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">Convert to customer</h2>
              <button 
                onClick={() => setToCustomerModal(false)} 
                className="text-gray-400 hover:text-white"
              >
                <X size={20} color='#fff' />
              </button>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleAddNewLead}>
                
                <div className="mb-4">
                  <label className="block mb-1 text-xs text-gray-400">
                    * First Name
                  </label>
                  <input 
                    type="text" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600"
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-1 text-xs text-gray-400">
                    * Last Name
                  </label>
                  <input 
                    type="text" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600"
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-1 text-xs text-gray-400">
                    Position
                  </label>
                  <input 
                    type="text" 
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600"
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-1 text-xs text-gray-400">
                    * Email
                  </label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600"
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-1 text-xs text-gray-400">
                    Company
                  </label>
                  <input 
                    type="text" 
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600"
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-1 text-xs text-gray-400">
                    Phone
                  </label>
                  <input 
                    type="text" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600"
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-1 text-xs text-gray-400">
                    Website
                  </label>
                  <input 
                    type="text" 
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600"
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-1 text-xs text-gray-400">
                    Address
                  </label>
                  <textarea 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600 resize-none"
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-1 text-xs text-gray-400">
                    City
                  </label>
                  <input 
                    type="text" 
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600"
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-1 text-xs text-gray-400">
                    State
                  </label>
                  <input 
                    type="text" 
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600"
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-1 text-xs text-gray-400">
                    Country
                  </label>
                  <select 
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600"
                  >
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block mb-1 text-xs text-gray-400">
                    Zip Code
                  </label>
                  <input 
                    type="text" 
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 dark:text-white text-gray-600"
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-1 text-xs text-gray-400">
                    * Password
                  </label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full dark:bg-gray-700 bg-gray-100 border border-gray-600 rounded p-2 pr-10 dark:text-white text-gray-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 mb-6">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="sendSetPasswordEmail"
                      name="sendSetPasswordEmail"
                      checked={formData.sendSetPasswordEmail}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label htmlFor="sendSetPasswordEmail" className="dark:text-gray-300 text-gray-600 text-sm">
                      Send SET password email
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="doNotSendWelcomeEmail"
                      name="doNotSendWelcomeEmail"
                      checked={formData.doNotSendWelcomeEmail}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label htmlFor="doNotSendWelcomeEmail" className="dark:text-gray-300 text-gray-600 text-sm">
                      Do not send welcome email
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 dark:border-t border-gray-700 pt-4 mt-4">
                  <button 
                    type="button"
                    onClick={() => setToCustomerModal(false)} 
                    className="px-4 py-2 dark:text-gray-300 text-gray-600 rounded dark:hover:bg-gray-700 dark:bg-gray-600 bg-gray-200"
                  >
                    Back to lead
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
      )}

    </>
  );
};

export default LeadModal;