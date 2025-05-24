'use client'
import { BarChart3, Filter, List, Users, Eye, Edit, Trash2, Plus } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import _ from 'lodash'

// Define upselling stages
type UpsellStage = 'Identified' | 'Contacted' | 'Proposal Sent' | 'Negotiating' | 'Closed Won' | 'Closed Lost';

interface Client {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  currentValue: string;
  potentialValue: string;
  upsellStage: UpsellStage;
  assigned: string;
  lastContact: string;
  created: string;
  tags: string[];
  type: 'sales_funnel' | 'regular_client';
}

const dummyClients: Client[] = [
  {
    id: 1,
    name: 'John Smith',
    company: 'Acme Corp',
    email: 'john.smith@acme.com',
    phone: '(555) 123-4567',
    currentValue: '$5,000',
    potentialValue: '$15,000',
    upsellStage: 'Identified',
    assigned: 'Sarah Johnson',
    lastContact: '2025-05-10',
    created: '2025-05-01',
    tags: ['Enterprise', 'Tech'],
    type: 'regular_client'
  },
  {
    id: 2,
    name: 'Emma Wilson',
    company: 'Globex Inc',
    email: 'emma.w@globex.com',
    phone: '(555) 234-5678',
    currentValue: '$8,500',
    potentialValue: '$25,000',
    upsellStage: 'Contacted',
    assigned: 'Mike Chen',
    lastContact: '2025-05-09',
    created: '2025-04-28',
    tags: ['High Value', 'Finance'],
    type: 'sales_funnel'
  },
  {
    id: 3,
    name: 'Robert Taylor',
    company: 'Stark Industries',
    email: 'rob.t@stark.com',
    phone: '(555) 345-6789',
    currentValue: '$12,000',
    potentialValue: '$40,000',
    upsellStage: 'Proposal Sent',
    assigned: 'Jessica Lee',
    lastContact: '2025-05-11',
    created: '2025-04-25',
    tags: ['Enterprise', 'Manufacturing'],
    type: 'regular_client'
  },
  {
    id: 4,
    name: 'Linda Martinez',
    company: 'Wayne Enterprises',
    email: 'linda@wayne.com',
    phone: '(555) 456-7890',
    currentValue: '$7,200',
    potentialValue: '$18,000',
    upsellStage: 'Negotiating',
    assigned: 'David Williams',
    lastContact: '2025-05-08',
    created: '2025-05-03',
    tags: ['Mid-tier', 'Retail'],
    type: 'sales_funnel'
  },
  {
    id: 5,
    name: 'Michael Brown',
    company: 'LexCorp',
    email: 'michael.b@lexcorp.com',
    phone: '(555) 567-8901',
    currentValue: '$9,800',
    potentialValue: '$30,000',
    upsellStage: 'Closed Won',
    assigned: 'Sarah Johnson',
    lastContact: '2025-05-06',
    created: '2025-04-20',
    tags: ['High Value', 'Energy'],
    type: 'regular_client'
  },
  {
    id: 6,
    name: 'Jennifer Davis',
    company: 'Oscorp',
    email: 'jennifer@oscorp.com',
    phone: '(555) 678-9012',
    currentValue: '$15,000',
    potentialValue: '$45,000',
    upsellStage: 'Closed Lost',
    assigned: 'Mike Chen',
    lastContact: '2025-05-12',
    created: '2025-04-15',
    tags: ['Enterprise', 'Healthcare'],
    type: 'sales_funnel'
  }
];

const stageColors: Record<UpsellStage, string> = {
  'Identified': 'bg-blue-400',
  'Contacted': 'bg-yellow-400',
  'Proposal Sent': 'bg-purple-400',
  'Negotiating': 'bg-orange-400',
  'Closed Won': 'bg-green-500',
  'Closed Lost': 'bg-red-400',
};

export default function UpsellDashboard(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<'sales_funnel' | 'regular_client'>('regular_client');
  const [viewMode, setViewMode] = useState<'stages' | 'clients'>('stages');
  const [clients] = useState<Client[]>(dummyClients);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [selectedStage, setSelectedStage] = useState<UpsellStage | 'All'>('All');

  

  // Filter clients based on active tab
  useEffect(() => {
    const tabFilteredClients = clients.filter(client => client.type === activeTab);
    if (selectedStage === 'All') {
      setFilteredClients(tabFilteredClients);
    } else {
      setFilteredClients(tabFilteredClients.filter(client => client.upsellStage === selectedStage));
    }
  }, [activeTab, clients, selectedStage]);

  // Calculate stage counts for current tab
  const getCurrentTabClients = () => clients.filter(client => client.type === activeTab);
  const stageCounts = _.countBy(getCurrentTabClients(), 'upsellStage');
  
  // Calculate total values
  const totalCurrentValue = getCurrentTabClients().reduce((sum, client) => {
    return sum + parseInt(client.currentValue.replace(/[$,]/g, ''));
  }, 0);
  
  const totalPotentialValue = getCurrentTabClients().reduce((sum, client) => {
    return sum + parseInt(client.potentialValue.replace(/[$,]/g, ''));
  }, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Stages View Component
  const StagesView = () => {
    const stageList: UpsellStage[] = ['Identified', 'Contacted', 'Proposal Sent', 'Negotiating', 'Closed Won', 'Closed Lost'];
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stageList.map(stage => {
          const stageClients = getCurrentTabClients().filter(client => client.upsellStage === stage);
          const stageValue = stageClients.reduce((sum, client) => {
            return sum + parseInt(client.potentialValue.replace(/[$,]/g, ''));
          }, 0);
          
          return (
            <div key={stage} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 p-4">
              <div className={`flex items-center justify-between p-3 rounded-lg ${stageColors[stage]} text-white mb-4`}>
                <h3 className="font-semibold text-sm">{stage}</h3>
                <span className="text-sm font-bold">{stageCounts[stage] || 0}</span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>Potential Value:</span>
                  <span className="font-semibold">{formatCurrency(stageValue)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>Avg per Client:</span>
                  <span className="font-semibold">
                    {stageClients.length > 0 ? formatCurrency(stageValue / stageClients.length) : '$0'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {stageClients.map(client => (
                  <div key={client.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">{client.name}</p>
                      <p className="text-gray-500 dark:text-gray-400">{client.company}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{client.potentialValue}</p>
                      <p className="text-gray-500 dark:text-gray-400">({client.currentValue})</p>
                    </div>
                  </div>
                ))}
                
                {stageClients.length === 0 && (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-xs">
                    No clients in this stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Clients View Component (Table format)
  const ClientsView = () => {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Current Value
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Potential Value
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Upsell Stage
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Assigned
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Last Contact
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredClients.map(client => (
                <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{client.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{client.company}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                    {client.currentValue}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-600">
                    {client.potentialValue}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${stageColors[client.upsellStage]}`}>
                      {client.upsellStage}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                    {client.assigned}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(client.lastContact).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                        <Eye size={14} />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800 dark:text-gray-400">
                        <Edit size={14} />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredClients.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <div className="flex flex-col items-center">
                <Users size={48} className="mb-2 opacity-50" />
                <p>No clients found</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 pb-16 pt-6 pr-6 flex flex-col text-indigo-600 overflow-x-hidden dark:text-gray-100 gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold dark:text-gray-100 text-gray-800">Upselling Dashboard</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm">
          <Plus size={16} />
          Add Upsell Opportunity
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Clients</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{getCurrentTabClients().length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Value</h3>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalCurrentValue)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Potential Value</h3>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPotentialValue)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Potential Uplift</h3>
          <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalPotentialValue - totalCurrentValue)}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('regular_client')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'regular_client'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            Regular Clients
          </button>
          <button
            onClick={() => setActiveTab('sales_funnel')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'sales_funnel'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            Sales Funnel
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Stage Filter */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500 dark:text-gray-400" />
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value as UpsellStage | 'All')}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm"
            >
              <option value="All">All Stages</option>
              {Object.keys(stageColors).map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex border border-gray-400 rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode('stages')}
              className={`flex items-center justify-center px-3 py-2 text-sm ${
                viewMode === 'stages'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <BarChart3 size={16} className="mr-1" />
              By Stages
            </button>
            <button
              onClick={() => setViewMode('clients')}
              className={`flex items-center justify-center px-3 py-2 text-sm ${
                viewMode === 'clients'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <List size={16} className="mr-1" />
              By Clients
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1">
        {viewMode === 'stages' ? <StagesView /> : <ClientsView />}
      </div>
    </div>
  );
}