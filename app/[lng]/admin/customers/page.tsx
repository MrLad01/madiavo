'use client'
import { ArrowRight, ArrowUpDown, ChevronDown, Filter, Info, Plus, RotateCw, Search, Tag, Upload, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link';
import { useT } from '@/app/i18n/client';

// Define TypeScript interfaces for our data
interface Customer {
  id: number;
  company: string;
  primaryContact: string;
  primaryEmail: string;
  phone: string;
  active: boolean;
  groups: string[];
  dateCreated: string;
  CompanyCode: string;
  address: string;
  VATcode: string;
  attributes: CustomerAttribute[]
}

interface CustomerAttribute {
  id: number;
  name: string;
  color: string;
  description?: string;
}

interface SortConfig {
  key: keyof Customer | null;
  direction: 'ascending' | 'descending' | null;
}

interface Country {
  id: number;
  iso2: string;
  shortName: string;
}



const availableAttributes: CustomerAttribute[] = [
  { id: 1, name: 'High Value', color: 'bg-green-500', description: 'High-value customer' },
  { id: 2, name: 'VIP', color: 'bg-purple-500', description: 'VIP customer' },
  { id: 3, name: 'New Client', color: 'bg-blue-500', description: 'Recently acquired customer' },
  { id: 4, name: 'At Risk', color: 'bg-red-500', description: 'Customer at risk of churning' },
  { id: 5, name: 'Upsell Ready', color: 'bg-orange-500', description: 'Ready for upselling' },
  { id: 6, name: 'Long Term', color: 'bg-indigo-500', description: 'Long-term customer' },
  { id: 7, name: 'Price Sensitive', color: 'bg-yellow-500', description: 'Price-sensitive customer' },
  { id: 8, name: 'Strategic', color: 'bg-pink-500', description: 'Strategic partnership' },
];

const dummyCustomers: Customer[] = [
  {
    id: 17,
    company: 'Init',
    primaryContact: '',
    primaryEmail: '',
    phone: '',
    active: true,
    groups: [],
    dateCreated: '2025-05-15 19:34:33',
    CompanyCode: 'a',
    address: 'a',
    VATcode: '',
    attributes: [availableAttributes[0], availableAttributes[2]]
  },
  {
    id: 22,
    company: 'Invinso',
    primaryContact: '',
    primaryEmail: '',
    phone: '',
    active: true,
    groups: [],
    dateCreated: '2025-05-15 19:37:25',
    CompanyCode: 'a',
    address: 'a',
    VATcode: '',
    attributes: [availableAttributes[1], availableAttributes[4]]
  },
  {
    id: 21,
    company: 'Mrwoo',
    primaryContact: '',
    primaryEmail: '',
    phone: '',
    active: true,
    groups: [],
    dateCreated: '2025-05-15 19:37:00',
    CompanyCode: 'a',
    address: 'a',
    VATcode: '',
    attributes: [availableAttributes[3]]
  },
  {
    id: 19,
    company: 'Perfektmedia',
    primaryContact: '',
    primaryEmail: '',
    phone: '',
    active: true,
    groups: [],
    dateCreated: '2025-05-15 19:36:25',
    CompanyCode: 'a',
    address: 'a',
    VATcode: '',
    attributes: [availableAttributes[5], availableAttributes[7]]
  },
  {
    id: 20,
    company: 'Puoškis',
    primaryContact: '',
    primaryEmail: '',
    phone: '',
    active: true,
    groups: [],
    dateCreated: '2025-05-15 19:36:41',
    CompanyCode: 'a',
    address: 'a',
    VATcode: '',
    attributes: [availableAttributes[6]]
  },
  {
    id: 23,
    company: 'Ranonis',
    primaryContact: '',
    primaryEmail: '',
    phone: '',
    active: true,
    groups: [],
    dateCreated: '2025-05-15 19:37:37',
    CompanyCode: 'a',
    address: 'a',
    VATcode: '',
    attributes: [availableAttributes[0], availableAttributes[1]]
  }
];

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>(dummyCustomers);
  const [countries, setCountries] = useState<Country[]>([]);
  // const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(dummyCustomers);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: null });
  // const [activeCustomers, setActiveCustomers] = useState<number>(7);
  // const [totalCustomers, setTotalCustomers] = useState<number>(7);
  // const [inactiveCustomers, setInactiveCustomers] = useState<number>(0);
  // const [activeContacts, setActiveContacts] = useState<number>(0);
  // const [inactiveContacts, setInactiveContacts] = useState<number>(0);
  // const [contactsLoggedIn, setContactsLoggedIn] = useState<number>(0);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [showNewCustomerModal, setShowNewCustomerModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState('details');

  const [selectedAttributeFilters, setSelectedAttributeFilters] = useState<number[]>([]);
  const [showAttributeFilter, setShowAttributeFilter] = useState(false);
  const [showAttributeModal, setShowAttributeModal] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { t } = useT('common');


  useEffect(() => {
    let filtered = customers;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.primaryContact.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.primaryEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.CompanyCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply attribute filters
    if (selectedAttributeFilters.length > 0) {
      filtered = filtered.filter(customer =>
        customer.attributes.some(attr => selectedAttributeFilters.includes(attr.id))
      );
    }

    setFilteredCustomers(filtered);
  }, [customers, searchTerm, selectedAttributeFilters]);

  // Select/deselect all rows
  useEffect(() => {
    if (selectAll) {
      setSelectedRows(filteredCustomers.map(customer => customer.id));
    } else {
      setSelectedRows([]);
    }
  }, [selectAll, filteredCustomers]);

  // Handle row selection
  const toggleRowSelection = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Handle toggle status change
  const toggleStatus = (id: number) => {
    const updatedCustomers = customers.map(customer =>
      customer.id === id ? { ...customer, active: !customer.active } : customer
    );
    setCustomers(updatedCustomers);
    setFilteredCustomers(updatedCustomers);
  };

   const toggleAttributeFilter = (attributeId: number) => {
    if (selectedAttributeFilters.includes(attributeId)) {
      setSelectedAttributeFilters(selectedAttributeFilters.filter(id => id !== attributeId));
    } else {
      setSelectedAttributeFilters([...selectedAttributeFilters, attributeId]);
    }
  };

  // Add attribute to customer
  const addAttributeToCustomer = (customerId: number, attributeId: number) => {
    const attribute = availableAttributes.find(attr => attr.id === attributeId);
    if (!attribute) return;

    const updatedCustomers = customers.map(customer => {
      if (customer.id === customerId) {
        const hasAttribute = customer.attributes.some(attr => attr.id === attributeId);
        if (!hasAttribute) {
          return { ...customer, attributes: [...customer.attributes, attribute] };
        }
      }
      return customer;
    });
    setCustomers(updatedCustomers);
  };

  // Remove attribute from customer
  const removeAttributeFromCustomer = (customerId: number, attributeId: number) => {
    const updatedCustomers = customers.map(customer =>
      customer.id === customerId
        ? { ...customer, attributes: customer.attributes.filter(attr => attr.id !== attributeId) }
        : customer
    );
    setCustomers(updatedCustomers);
  };

  // Handle column sorting
  const requestSort = (key: keyof Customer | null) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    // Apply sorting
    const sortedItems = [...filteredCustomers].sort((a, b) => {
      if (!key) return 0;
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setFilteredCustomers(sortedItems);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const parts = dateString.split(' ');
    if (parts.length === 2) {
      return (
        <div className="flex flex-col">
          <span>{parts[0]}</span>
          <span>{parts[1]}</span>
        </div>
      );
    }
    return dateString;
  };

  const handleAddNewCustomer = (e: React.FormEvent) => {
      e.preventDefault();
      // Implementation would go here
      setShowNewCustomerModal(false);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedAttributeFilters([]);
    setSearchTerm('');
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/country', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const responseData = await response.json();
        

        setCountries(
          Array.isArray(responseData.data)
            ? responseData.data.map((country: Country) => ({
                id: country.id,
                iso2: country.iso2,
                shortName: country.shortName,
              }))
            : []
        );
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex-1 dark:bg-gray-900 bg-transparent min-h-screen pb-16 pt-6 px-6 flex flex-col text-indigo-600 overflow-x-hidden dark:text-gray-100">
      <div>
      <h1 className="text-2xl font-bold dark:text-gray-300 text-gray-800">{t('Customers')}</h1>
      <Link href="/" className="flex items-center gap-2 py-1">
          <p className="text-sm dark:text-gray-300 text-gray-600">Contacts</p>
          <ArrowRight size={16} className='dark:text-gray-300 text-gray-600' />
        </Link>
      </div>
      
      {/* Stat boxes */}
      <div className="flex gap-2 mt-4 text-xs">
        <div className="dark:bg-inherit bg-white shadow-sm dark:border dark:border-gray-500  flex items-center justify-start rounded-md py-2 px-3">
          <p className="dark:text-white text-gray-600"><span className="font-normal mr-1">{customers.length}</span> Total Customers</p>
        </div>
        <div className="dark:bg-inherit bg-white shadow-sm dark:border dark:border-gray-500  flex items-center justify-start rounded-md py-2 px-3">
          <p><span className="dark:text-white text-gray-600 mr-1 ">{customers.filter(c => c.active).length}</span> <span className="text-green-500 font-extralight">Active Customers</span></p>
        </div>
        <div className="dark:bg-inherit bg-white shadow-sm dark:border dark:border-gray-500  flex items-center justify-start rounded-md py-2 px-3">
          <p><span className="dark:text-white text-gray-600 mr-1">{customers.filter(c => !c.active).length}</span> <span className="text-red-500 font-extralight">Inactive Customers</span></p>
        </div>
        <div className="dark:bg-inherit bg-white shadow-sm dark:border dark:border-gray-500  flex items-center justify-start rounded-md py-2 px-3">
          <p><span className="dark:text-white text-gray-600 mr-1">0</span> <span className="text-blue-500 font-extralight">Active Contacts</span></p>
        </div>
        <div className="dark:bg-inherit bg-white shadow-sm dark:border dark:border-gray-500  flex items-center justify-start rounded-md py-2 px-3">
          <p><span className="dark:text-white text-gray-600 mr-1">0</span> <span className="text-red-500 font-extralight">Inactive Contacts</span></p>
        </div>
        <div className="dark:bg-inherit bg-white shadow-sm dark:border dark:border-gray-500  flex items-center justify-start rounded-md py-2 px-3">
          <p className=" text-gray-400"><span className="dark:text-white text-gray-600 mr-1">0</span> Contacts Logged In Today</p>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex mt-6 justify-between">
        <div className="flex gap-2">
          <button onClick={() => setShowNewCustomerModal(true)} className="flex items-center justify-between text-xs px-3 py-2 cursor-pointer rounded-lg bg-blue-500 text-white hover:bg-blue-600">
            <Plus size={16} className="mr-2"  /> New Customer
          </button>
          <button className="flex items-center justify-between text-xs px-3 py-2 cursor-pointer rounded-lg bg-white dark:bg-transparent dark:text-gray-200 text-gray-600 border border-gray-400 dark:hover:bg-gray-700">
            <Upload size={16} className="mr-2" /> Import Customers
          </button>
        </div>
        {/* <button className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg border border-gray-400 text-gray-500 shadow-sm text-xs dark:text-gray-200 dark:bg-transparent bg-white hover:bg-gray-100 dark:hover:bg-gray-500 dark:hover:text-blue-200">
          <Filter size={16} className="mr-2" /> Filters
        </button> */}
        <div className="flex gap-2">
          <div className="relative">
            <button 
              onClick={() => setShowAttributeFilter(!showAttributeFilter)}
              className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg border border-gray-400 text-gray-500 shadow-sm text-xs dark:text-gray-200 dark:bg-transparent bg-white hover:bg-gray-100 dark:hover:bg-gray-500 dark:hover:text-blue-200"
            >
              <Tag size={16} className="mr-1" /> Attributes
              {selectedAttributeFilters.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-blue-500 text-white rounded-full text-xs">
                  {selectedAttributeFilters.length}
                </span>
              )}
            </button>
              
              {/* Attribute Filter Dropdown */}
              {showAttributeFilter && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm dark:text-white text-gray-800">Filter by Attributes</h3>
                      {selectedAttributeFilters.length > 0 && (
                        <button 
                          onClick={clearAllFilters}
                          className="text-xs text-blue-500 hover:text-blue-600"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="p-2 max-h-64 overflow-y-auto">
                    {availableAttributes.map(attribute => (
                      <label key={attribute.id} className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedAttributeFilters.includes(attribute.id)}
                          onChange={() => toggleAttributeFilter(attribute.id)}
                          className="mr-2"
                        />
                        <div className={`w-3 h-3 rounded-full ${attribute.color} mr-2`}></div>
                        <div className="flex-1">
                          <div className="text-sm dark:text-white text-gray-800">{attribute.name}</div>
                          {attribute.description && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">{attribute.description}</div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg border border-gray-400 text-gray-500 shadow-sm text-xs dark:text-gray-200 dark:bg-transparent bg-white hover:bg-gray-100 dark:hover:bg-gray-500 dark:hover:text-blue-200">
              <Filter size={16} className="mr-2" /> Filters
            </button>
        </div>
      </div>

          {(selectedAttributeFilters.length > 0 || searchTerm) && (
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500 dark:text-gray-400">Active filters:</span>
          {selectedAttributeFilters.map(filterId => {
            const attribute = availableAttributes.find(attr => attr.id === filterId);
            return attribute ? (
              <div key={filterId} className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                <div className={`w-2 h-2 rounded-full ${attribute.color}`}></div>
                {attribute.name}
                <button 
                  onClick={() => toggleAttributeFilter(filterId)}
                  className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
                >
                  <X size={12} />
                </button>
              </div>
            ) : null;
          })}
          {searchTerm && (
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs">
              Search: &quot;{searchTerm}&quot;
              <button 
                onClick={() => setSearchTerm('')}
                className="ml-1 text-green-600 hover:text-green-800 dark:text-green-300 dark:hover:text-green-100"
              >
                <X size={12} />
              </button>
            </div>
          )}
          <button 
            onClick={clearAllFilters}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline"
          >
            Clear all filters
          </button>
        </div>
      )}
      
      {/* Table controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 mt-4 overflow-x-auto relative">
        <div className="flex justify-between p-4 border-b bg-white dark:bg-transparent border-gray-200 dark:border-gray-700 text-sm">
          <div className="flex items-center gap-2">
            <select className="border border-gray-200  rounded-md px-2 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
            <button className="px-4 py-1 border cursor-pointer border-gray-300 text-xs rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800">
              Export
            </button>
            <button className="px-4 py-1 border border-gray-300  rounded-md cursor-pointer text-gray-700 text-xs dark:text-gray-300 bg-white dark:bg-gray-800">
              Bulk Actions
            </button>
            <button className="p-1 border rounded-md cursor-pointer text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-gray-300 ">
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
        <div className="overflow-x-auto pb-5">
          <table className="w-full text-left ">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600 py-1">
                <th className="p-1.5 w-10">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={() => setSelectAll(!selectAll)}
                    className="rounded"
                  />
                </th>
                <th className="p-1.5 text-xs font-medium text-gray-400 min-w-12 cursor-pointer" onClick={() => requestSort('id')}>
                  <div className="flex items-center">
                    # <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-1.5 text-xs font-medium text-gray-400 min-w-32 cursor-pointer" onClick={() => requestSort('company')}>
                  <div className="flex items-center">
                    Company <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-1.5 text-xs font-medium text-gray-400 min-w-40 cursor-pointer" onClick={() => requestSort('primaryContact')}>
                  <div className="flex items-center">
                    Primary Contact <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-1.5 text-xs font-medium text-gray-400 min-w-40 cursor-pointer" onClick={() => requestSort('primaryEmail')}>
                  <div className="flex items-center">
                    Primary Email <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-1.5 text-xs font-medium text-gray-400 min-w-32 cursor-pointer" onClick={() => requestSort('phone')}>
                  <div className="flex items-center">
                    Phone <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-1.5 text-xs font-medium text-gray-400 min-w-24 cursor-pointer" onClick={() => requestSort('active')}>
                  <div className="flex items-center">
                    Active <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-1.5 text-xs font-medium text-gray-400 min-w-40">
                  Attributes
                </th>
                <th className="p-1.5 text-xs font-medium text-gray-400 min-w-24 cursor-pointer" onClick={() => requestSort('groups')}>
                  <div className="flex items-center">
                    Groups <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-1.5 text-xs font-medium text-gray-400 min-w-36 cursor-pointer" onClick={() => requestSort('dateCreated')}>
                  <div className="flex items-center">
                    Date Created <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-1.5 text-xs font-medium text-gray-400 min-w-32 cursor-pointer" onClick={() => requestSort('CompanyCode')}>
                  <div className="flex items-center">
                    Company Code <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-1.5 text-xs font-medium text-gray-400 min-w-32 cursor-pointer" onClick={() => requestSort('address')}>
                  <div className="flex items-center">
                    Address <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
                <th className="p-1.5 text-xs font-medium text-gray-400 min-w-32 cursor-pointer" onClick={() => requestSort('VATcode')}>
                  <div className="flex items-center">
                    VAT <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className='text-sm'>
              {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <tr 
                  key={customer.id} 
                  className="border-b  dark:border-gray-500 border-gray-300  dark:hover:bg-gray-800 py-1" 
                  onMouseEnter={() => setHoveredRow(customer.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="p-1.5">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(customer.id)}
                      onChange={() => toggleRowSelection(customer.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-300">{customer.id}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-300 relative">
                    {customer.company}
                    {hoveredRow === customer.id && (
                      <div className="absolute bottom-1 -left-0.5 flex gap-1">
                        <button className=" text-gray-400 text-[10px] cursor-pointer rounded">View |</button>
                        <button className=" text-gray-400 text-[10px] cursor-pointer rounded">Edit |</button>
                        <button className=" text-red-500 text-[10px] cursor-pointer rounded">X Delete</button>
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-300">
                  { customer.primaryContact}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-300">{customer.primaryEmail}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-300">{customer.phone}</td>
                  <td className="p-1.5">
                    <div 
                      className={`w-12 h-6 rounded-full ${customer.active ? 'bg-green-500' : 'dark:bg-gray-700 bg-gray-300'}  p-1 cursor-pointer`}
                      onClick={() => toggleStatus(customer.id)}
                    >
                      <div className={`w-4 h-4 rounded-full transition-transform  ${customer.active ? 'bg-white transform translate-x-6' : 'bg-white'}`}></div>
                    </div>
                  </td>
                   <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-1 items-center">
                        {customer.attributes.map(attribute => (
                          <div 
                            key={attribute.id}
                            className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] text-white group relative cursor-pointer"
                            style={{ backgroundColor: attribute.color.replace('bg-', '').replace('-500', '') === 'green' ? '#10b981' :
                              attribute.color.replace('bg-', '').replace('-500', '') === 'purple' ? '#8b5cf6' :
                              attribute.color.replace('bg-', '').replace('-500', '') === 'blue' ? '#3b82f6' :
                              attribute.color.replace('bg-', '').replace('-500', '') === 'red' ? '#ef4444' :
                              attribute.color.replace('bg-', '').replace('-500', '') === 'orange' ? '#f97316' :
                              attribute.color.replace('bg-', '').replace('-500', '') === 'indigo' ? '#6366f1' :
                              attribute.color.replace('bg-', '').replace('-500', '') === 'yellow' ? '#eab308' :
                              attribute.color.replace('bg-', '').replace('-500', '') === 'pink' ? '#ec4899' : '#6b7280' }}
                          >
                            <span>{attribute.name}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeAttributeFromCustomer(customer.id, attribute.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 hover:border-white hover:bg-opacity-20 rounded-full p-0.5"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            setEditingCustomerId(customer.id);
                            setShowAttributeModal(true);
                          }}
                          className="flex items-center justify-center w-6 h-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-full text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-300">{customer.groups.join(', ')}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-300">{formatDate(customer.dateCreated)}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-300">{customer.CompanyCode}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-300">{customer.address}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-300">{customer.VATcode}</td>
                </tr>
              ))
              ) : (
              <tr>
                <td colSpan={13} className="px-3 py-16 text-center text-gray-500 dark:text-gray-400">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-20 h-20 mb-4 text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
                          <path d="M13 8L9 12l4 4" />
                        </svg>
                      </div>
                    <p className="text-lg font-medium">No entries found</p>
                    <p className="mt-1 text-xs">Try adjusting your filters or search terms</p>
                  </div>
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
        {showAttributeModal && editingCustomerId && (
          <div className="fixed inset-0 bg-[#00000090] bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold dark:text-white text-gray-800">
                  Manage Attributes
                </h3>
                <button
                  onClick={() => {
                    setShowAttributeModal(false);
                    setEditingCustomerId(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-2">
                {availableAttributes.map(attribute => {
                  const customer = customers.find(c => c.id === editingCustomerId);
                  const hasAttribute = customer?.attributes.some(attr => attr.id === attribute.id);
                  
                  return (
                    <div key={attribute.id} className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${attribute.color}`}></div>
                        <div>
                          <div className="text-sm font-medium dark:text-white text-gray-800">
                            {attribute.name}
                          </div>
                          {attribute.description && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {attribute.description}
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (hasAttribute) {
                            removeAttributeFromCustomer(editingCustomerId, attribute.id);
                          } else {
                            addAttributeToCustomer(editingCustomerId, attribute.id);
                          }
                        }}
                        className={`px-3 py-1 rounded-md text-xs transition-colors ${
                          hasAttribute
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        {hasAttribute ? 'Remove' : 'Add'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        
        {/* Pagination */}
        <div className="flex justify-between p-4">
          <span className="text-xs text-gray-500 dark:text-gray-400">Showing 1 to {filteredCustomers.length} of {filteredCustomers.length} entries</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50">Previous</button>
            <button className="px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-blue-500 text-white hover:bg-blue-600">1</button>
            <button className='px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'>Next</button>
          </div>
        </div>
      </div>

      {showNewCustomerModal &&
      (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800  border border-gray-700 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center bg-blue-400 p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Add New Customer</h2>
          <button 
            onClick={() => setShowNewCustomerModal(false)} 
            className="text-gray-400 hover:text-white"
          >
            <X size={20} color='#fff' />
          </button>
        </div>
        
        <div className="dark:bg-gray-800 bg-white px-6 py-3">
          <div className="flex">
            <button
              className={`py-2 px-4 ${activeTab === 'details' ? 'dark:text-white text-gray-700 border-b-2 border-blue-500' : 'text-gray-400'}`}
              onClick={() => setActiveTab('details')}
            >
              Customer Details
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'custom' ? 'dark:text-white text-gray-700 border-b-2 border-blue-500' : 'text-gray-400'}`}
              onClick={() => setActiveTab('custom')}
            >
              Custom Fields
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'billing' ? 'dark:text-white text-gray-700 border-b-2 border-blue-500' : 'text-gray-400'}`}
              onClick={() => setActiveTab('billing')}
            >
              Billing & Shipping
            </button>
          </div>
        </div>
        
        <div className="p-6 dark:bg-gray-800 bg-white">
          {activeTab === 'details' && (
            <div>
              <div className="mb-4">
                <label className="block mb-1 text-xs text-gray-400">
                  Company
                </label>
                <input 
                  type="text" 
                  className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white"
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1 text-xs text-gray-400">
                  Phone
                </label>
                <input 
                  type="tel" 
                  className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white"
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1 text-xs text-gray-400">
                  Website
                </label>
                <input 
                  type="url" 
                  className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white"
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1 text-xs text-gray-400">
                  Groups
                </label>
                <div className="relative">
                  <select className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white appearance-none">
                    <option>Nothing selected</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className=" mb-1 text-xs text-gray-400 flex items-center">
                    <span className="mr-1">$</span> Currency
                  </label>
                  <div className="relative">
                    <select className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white appearance-none">
                      <option>System Default</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronDown size={16} className="text-gray-400" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block mb-1 text-xs text-gray-400">
                    Default Language
                  </label>
                  <div className="relative">
                    <select className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white appearance-none">
                      <option>System Default</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronDown size={16} className="text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block mb-1 text-xs text-gray-400">
                  Address
                </label>
                <textarea 
                  className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white h-24"
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1 text-xs text-gray-400">
                  City
                </label>
                <input 
                  type="text" 
                  className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white"
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1 text-xs text-gray-400">
                  State
                </label>
                <input 
                  type="text" 
                  className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white"
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1 text-xs text-gray-400">
                  Zip Code
                </label>
                <input 
                  type="text" 
                  className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white"
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1 text-xs text-gray-400">
                  Country
                </label>
                <div className="relative">
                  <select className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white appearance-none">
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.shortName}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'custom' && (
            <div>
              <div className="mb-4">
                <label className="flex items-center mb-1 text-xs text-gray-400">
                  <span className="text-red-500 mr-1">*</span> Company Code
                </label>
                <input 
                  type="text" 
                  className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white"
                />
              </div>
              
              <div className="mb-4">
                <label className="flex items-center mb-1 text-xs text-gray-400">
                  <span className="text-red-500 mr-1">*</span> Address
                </label>
                <textarea 
                  className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white h-24"
                />
              </div>
              
              <div className="mb-4">
                <label className="flex items-center mb-1 text-xs text-gray-400">
                  VAT payer code
                </label>
                <input 
                  type="text" 
                  className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white"
                />
              </div>
            </div>
          )}
          
          {activeTab === 'billing' && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="dark:text-white text-gray-600 mb-3">Billing Address</h3>
                
                <div className="mb-2 text-gray-400 text-sm">
                  <label className="inline-flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Same as Customer Info
                  </label>
                </div>
                
                <div className="mb-4">
                  <label className="block mb-1 text-xs text-gray-400">
                    Street
                  </label>
                  <textarea 
                    className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white h-24"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block mb-1 text-xs text-gray-400">
                    City
                  </label>
                  <input 
                    type="text" 
                    className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block mb-1 text-xs text-gray-400">
                    State
                  </label>
                  <input 
                    type="text" 
                    className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block mb-1 text-xs text-gray-400">
                    Zip Code
                  </label>
                  <input 
                    type="text" 
                    className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block mb-1 text-xs text-gray-400">
                    Country
                  </label>
                  <div className="relative">
                    <select className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white appearance-none">
                      <option>Nothing selected</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronDown size={16} className="text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <h3 className="dark:text-white text-gray-600">Shipping Address</h3>
                    <Info size={16} className="text-gray-400 ml-2" />
                  </div>
                  <button 
                    type="button" 
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Copy Billing Address
                  </button>
                </div>
                
                <div className="mb-4">
                  <label className="block mb-1 text-xs text-gray-400">
                    Street
                  </label>
                  <textarea 
                    className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white h-24"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block mb-1 text-xs text-gray-400">
                    City
                  </label>
                  <input 
                    type="text" 
                    className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block mb-1 text-xs text-gray-400">
                    State
                  </label>
                  <input 
                    type="text" 
                    className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block mb-1 text-xs text-gray-400">
                    Zip Code
                  </label>
                  <input 
                    type="text" 
                    className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block mb-1 text-xs text-gray-400">
                    Country
                  </label>
                  <div className="relative">
                    <select className="w-full dark:bg-gray-700 bg-white border border-gray-600 rounded p-2 text-white appearance-none">
                      <option>Nothing selected</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronDown size={16} className="text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-2 dark:border-t border-gray-700 pt-4 mt-6">
            <button 
              type="button"
              onClick={() => setShowNewCustomerModal(false)} 
              className="px-4 py-2 text-white rounded hover:bg-gray-700 bg-gray-600"
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={handleAddNewCustomer}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {activeTab === 'billing' ? 'Save and create contact' : 'Save'}
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