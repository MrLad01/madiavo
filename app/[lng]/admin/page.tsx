'use client'

import React, { useState, useEffect } from 'react'
import { Search, Plus, BarChart3, Check, Clock, Ticket, Megaphone, FileBarChart2, GripVertical, TrendingUp, Expand, BadgeCheck, TriangleAlert, FileCheck, SlidersHorizontal, ChevronRight, MoreHorizontal, ArrowUpRight, X, Filter } from 'lucide-react'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface DraggableWidgetProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

// Widget component with drag functionality only at the handle
const DraggableWidget: React.FC<DraggableWidgetProps> = ({ id, title, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  
  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="relative text-indigo-600 border border-gray-100 dark:border-gray-700 shadow-lg rounded-xl overflow-hidden bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-xl"
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div 
            {...attributes} 
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1.5 rounded-full bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <GripVertical size={14} className="text-gray-500 dark:text-gray-400" />
          </div>
          <h3 className="text-base font-medium dark:text-gray-200">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <MoreHorizontal size={16} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>
      <div>
        {children}
      </div>
    </div>
  )
}

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  startValue?: number;
  endValue?: number;
  color?: string;
  trend?: number;
  trendLabel?: string;
}

// Metric Card Component
const MetricCard: React.FC<MetricCardProps> = ({ icon, title, startValue, endValue, color, trend, trendLabel }) => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-xl p-6 flex flex-col gap-4 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex gap-3 items-center">
          <div className={`p-2 rounded-lg ${color ? color.replace('bg-', 'bg-opacity-20 ') : 'bg-blue-100 dark:bg-blue-900 bg-opacity-50'}`}>
            {icon}
          </div>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</div>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            <ArrowUpRight size={14} className={trend < 0 ? 'rotate-180' : ''} />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      
      <div className="flex items-end justify-between">
        <div className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{startValue}</div>
        <div className="text-xs text-gray-500">Target: {endValue}</div>
      </div>
      
      <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full ${color || 'bg-blue-500'} rounded-full transition-all duration-500`} style={{ width: `${(startValue || 0) / (endValue || 1) * 100}%` }}></div>
      </div>
      
      {trendLabel && (
        <div className="text-xs text-gray-500 dark:text-gray-400">{trendLabel}</div>
      )}
    </div>
  )
}

// Todo Item Component
const TodoItem: React.FC<{ status: 'pending' | 'completed'; title: string; date: string }> = ({ status, title, date }) => {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        {status === 'pending' ? (
          <div className="w-5 h-5 rounded-full border-2 border-indigo-500 flex items-center justify-center" />
        ) : (
          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
            <Check size={12} className="text-white" />
          </div>
        )}
        <span className={`text-sm ${status === 'completed' ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
          {title}
        </span>
      </div>
      <div className="text-xs text-gray-400">{date}</div>
    </div>
  )
}

// To-Do Section Component
const TodoSection: React.FC = () => {
  const [tab, setTab] = useState('pending')
  
  return (
    <div className="p-6 flex flex-col w-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <button 
            onClick={() => setTab('pending')}
            className={`pb-2 text-sm font-medium transition-colors ${tab === 'pending' 
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' 
              : 'text-gray-500 dark:text-gray-400'}`}
          >
            Pending
          </button>
          <button 
            onClick={() => setTab('completed')}
            className={`pb-2 text-sm font-medium transition-colors ${tab === 'completed' 
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' 
              : 'text-gray-500 dark:text-gray-400'}`}
          >
            Completed
          </button>
        </div>
        <button className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900 dark:bg-opacity-30 py-1.5 px-3 rounded-full">
          <Plus size={14} />
          <span>New Task</span>
        </button>
      </div>
      
      {tab === 'pending' ? (
        <div className="space-y-1">
          <TodoItem status="pending" title="Call with marketing team" date="Today" />
          <TodoItem status="pending" title="Review project proposal" date="Tomorrow" />
          <TodoItem status="pending" title="Prepare quarterly report" date="May 15" />
        </div>
      ) : (
        <div className="space-y-1">
          <TodoItem status="completed" title="Update client database" date="Yesterday" />
          <TodoItem status="completed" title="Client meeting with ABC Corp" date="May 10" />
        </div>
      )}
      
      <button className="flex items-center justify-center gap-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 py-3 mt-4 hover:bg-indigo-50 dark:hover:bg-indigo-900 dark:hover:bg-opacity-20 rounded-lg transition-colors">
        <span>View All Tasks</span>
        <ChevronRight size={14} />
      </button>
    </div>
  )
}

// Tabbed Section Component
const TabbedSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tasks')
  
  return (
    <div className="p-6 flex flex-col w-full">
      <div className="flex gap-1 mb-6 bg-gray-50 dark:bg-gray-700 p-1 rounded-lg">
        <button 
          className={`flex items-center justify-center gap-2 py-2 px-4 text-xs rounded-md transition-all ${activeTab === 'tasks' 
            ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-white shadow-sm' 
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          onClick={() => setActiveTab('tasks')}
        >
          <Check size={14} />
          <span>Tasks</span>
        </button>
        <button 
          className={`flex items-center justify-center gap-2 py-2 px-4 text-xs rounded-md transition-all ${activeTab === 'projects' 
            ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-white shadow-sm' 
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          onClick={() => setActiveTab('projects')}
        >
          <BarChart3 size={14} />
          <span>Projects</span>
        </button>
        <button 
          className={`flex items-center justify-center gap-2 py-2 px-4 text-xs rounded-md transition-all ${activeTab === 'reminders' 
            ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-white shadow-sm' 
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          onClick={() => setActiveTab('reminders')}
        >
          <Clock size={14} />
          <span>Reminders</span>
        </button>
        <button 
          className={`flex items-center justify-center gap-2 py-2 px-4 text-xs rounded-md transition-all ${activeTab === 'tickets' 
            ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-white shadow-sm' 
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          onClick={() => setActiveTab('tickets')}
        >
          <Ticket size={14} />
          <span>Tickets</span>
        </button>
      </div>
      
      <div className="flex justify-between mb-6">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 py-1.5 px-3 text-xs font-medium bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
            <Filter size={14} />
            <span>Filter</span>
          </button>
          <button className="flex items-center gap-2 py-1.5 px-3 text-xs font-medium bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
            Export
          </button>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg pl-9 pr-4 py-1.5 text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20 transition-all"
            placeholder="Search..."
          />
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-700 shadow-sm border border-gray-100 dark:border-gray-600 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-600">
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400">Title</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400">Status</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400">Due Date</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400">Priority</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} className="text-center py-10 text-sm text-gray-500 dark:text-gray-400">
                No {activeTab} found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Leads Overview Component
const LeadsOverview: React.FC = () => {
  return (
    <div className="p-6 flex flex-col w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base font-medium text-gray-800 dark:text-gray-200">Leads Status</h3>
        <select className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20 transition-all">
          <option>This Month</option>
          <option>Last Month</option>
          <option>Last Quarter</option>
        </select>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-lg p-4 flex flex-col">
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Leads</div>
          <div className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-2">146</div>
          <div className="flex items-center gap-1 text-xs text-green-500 mt-2">
            <ArrowUpRight size={14} />
            <span>24.5% from last month</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-lg p-4 flex flex-col">
          <div className="text-sm text-gray-500 dark:text-gray-400">Converted</div>
          <div className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-2">42</div>
          <div className="flex items-center gap-1 text-xs text-green-500 mt-2">
            <ArrowUpRight size={14} />
            <span>18.2% from last month</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-lg p-4 flex flex-col">
          <div className="text-sm text-gray-500 dark:text-gray-400">Lost</div>
          <div className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-2">28</div>
          <div className="flex items-center gap-1 text-xs text-red-500 mt-2">
            <ArrowUpRight size={14} className="rotate-180" />
            <span>5.3% from last month</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Derinama</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Skambinama</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Ruošiama sutartis</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-500"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Laukiama atsatymo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Prarasta</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Klientas</span>
        </div>
      </div>
      
      {/* This is where you would integrate a chart */}
      <div className="bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-lg p-6 h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        Chart would be displayed here
      </div>
    </div>
  )
}

interface Widget {
  id: string;
  type: 'metrics' | 'todo' | 'tabbed' | 'leads';
  title: string;
}

export default function DashboardPage() {
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: 'metrics-row', type: 'metrics', title: 'Key Metrics' },
    { id: 'todo-section', type: 'todo', title: 'My To Do Items' },
    { id: 'tabbed-section', type: 'tabbed', title: 'My Activities' },
    { id: 'leads-overview', type: 'leads', title: 'Leads Overview' }
  ])

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    
    if (active.id !== over.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id)
        const newIndex = items.findIndex(item => item.id === over.id)
        
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  return (
    <div className="flex-1 pl-[20vw] pr-6 py-8  dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Dashboard</h1>
        </div>

        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={widgets.map(widget => widget.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-1 gap-6">
              {widgets.map((widget) => {
                switch (widget.type) {
                  case 'metrics':
                    return (
                      <DraggableWidget key={widget.id} id={widget.id} title={widget.title}>
                        <div className="grid grid-cols-3 gap-4">
                          <MetricCard icon={<FileBarChart2 size={20} />} title="Total Sales" startValue={1200} endValue={1500} color="bg-blue-500" trend={20} trendLabel="from last month" />
                          <MetricCard icon={<BadgeCheck size={20} />} title="New Customers" startValue={300} endValue={400} color="bg-green-500" trend={15} trendLabel="from last month" />
                          <MetricCard icon={<TriangleAlert size={20} />} title="Pending Orders" startValue={50} endValue={30} color="bg-red-500" trend={-10} trendLabel="from last month" />
                        </div>
                      </DraggableWidget>
                    )
                  case 'todo':
                    return (
                      <DraggableWidget key={widget.id} id={widget.id} title={widget.title}>
                        <TodoSection />
                      </DraggableWidget>
                    )
                  case 'tabbed':
                    return (
                      <DraggableWidget key={widget.id} id={widget.id} title={widget.title}>
                        <TabbedSection />
                      </DraggableWidget>
                    )
                  case 'leads':
                    return (
                      <DraggableWidget key={widget.id} id={widget.id} title={widget.title}>
                        <LeadsOverview />
                      </DraggableWidget>
                    )
                  default:
                    return null
                }
              })}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  )
}