'use client'

import React, { useState, useEffect } from 'react'
import { Search, Plus, BarChart3, Check, Clock, Ticket, Megaphone, FileBarChart2, GripVertical, TrendingUp, Expand, BadgeCheck, TriangleAlert } from 'lucide-react'
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
      className="relative text-indigo-600 border dark:border-none border-[#4f39f630] shadow-md p-2 bg-white dark:bg-[#1e293950] dark:text-gray-300 rounded-lg overflow-hidden"
    >
      <div className="flex items-center px-4 pt-2 pb-1 shadow-xs dark:border-gray-700">
        <div 
          {...attributes} 
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 mr-1 rounded"
        >
          <Expand size={10} />
        </div>
        <h3 className="text-[10px] font-medium">{title}</h3>
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
}

// Metric Card Component
const MetricCard: React.FC<MetricCardProps> = ({ icon, title, startValue, endValue, color }) => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-[#4f39f630] text-indigo-600 shadow-md dark:text-gray-200 rounded-lg p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex justify-between gap-3 items-center">
          {icon}
          <div className="text-sm font-medium">{title}</div>
        </div>
        <span>{startValue} / {endValue}</span>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${(startValue || 0) / (endValue || 1) * 100}%` }}></div>
      </div>
    </div>
  )
}

// To-Do Section Component
const TodoSection: React.FC = () => {
  return (
    <div className="p-4 flex flex-col w-full">
      <div className="flex justify-between items-center border-b pb-2.5 dark:border-gray-500 mb-4">
        <div className="flex items-center gap-1">
          <BadgeCheck size={20} />
          <h3 className="text-[14px] font-medium">My To Do Items</h3>
        </div>
        <div className="flex gap-2">
          <span className="text-[11px] text-gray-300">View All</span>
          <span className="text-[11px] text-gray-300">|</span>
          <span className="text-[11px] text-gray-300">New To Do</span>
        </div>
      </div>
      
      {/* Latest to do's */}
      <div className="mb-4">
        <div className="flex gap-1 mb-2">
          <span className="text-red-400">
            <TriangleAlert size={16} className='font-semibold' />
          </span>
          <span className="text-red-400 text-[14px] font-semibold">Latest to do's</span>
        </div>
        <div className="text-gray-400 p-6 text-[14px]">No todos found</div>
      </div>
      
      {/* Latest finished to do's */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-green-400">✓</span>
          <span className="text-green-400  text-[14px] font-semibold">Latest finished to do's</span>
        </div>
        <div className="text-gray-400 p-6 text-[14px]">No finished todos found</div>
      </div>
    </div>
  )
}

// Tabbed Section Component
const TabbedSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tasks')
  
  return (
    <div className="p-4 flex flex-col w-full">
      <div className="flex gap-4 border-gray-700 text-[14px] pb-2 mb-4">
        <button 
          className={`flex items-center gap-2 pb-2 ${activeTab === 'tasks' ? 'border-b-2 border-blue-400' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          <Check size={16} />
          <span>My Tasks</span>
        </button>
        <button 
          className={`flex items-center gap-2 pb-2 ${activeTab === 'projects' ? 'border-b-2 border-blue-400' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          <BarChart3 size={16} />
          <span>My Projects</span>
        </button>
        <button 
          className={`flex items-center gap-2 pb-2 ${activeTab === 'reminders' ? 'border-b-2 border-blue-400' : ''}`}
          onClick={() => setActiveTab('reminders')}
        >
          <Clock size={16} />
          <span>My Reminders</span>
        </button>
        <button 
          className={`flex items-center gap-2 pb-2 ${activeTab === 'tickets' ? 'border-b-2 border-blue-400' : ''}`}
          onClick={() => setActiveTab('tickets')}
        >
          <Ticket size={16} />
          <span>Tickets</span>
        </button>
        <button 
          className={`flex items-center gap-2 pb-2 ${activeTab === 'announcements' ? 'border-b-2 border-blue-400' : ''}`}
          onClick={() => setActiveTab('announcements')}
        >
          <Megaphone size={16} />
          <span>Announcements</span>
        </button>
      </div>
      
      <div className="flex justify-between mb-4">
        <span className="text-sm text-gray-300">View All</span>
        <div className="flex gap-2 items-center">
          <select className="dark:bg-gray-700 border text-gray-300 rounded px-2 py-1 text-sm">
            <option>25</option>
            <option>50</option>
            <option>100</option>
          </select>
          <button className="text-sm text-gray-300">Export</button>
          <div className="relative">
            <Search size={18} className="absolute left-2 top-1.5 text-gray-400" />
            <input
              className="dark:bg-gray-700 border rounded-md pl-8 pr-2 py-1 text-sm text-gray-300 placeholder-gray-400 w-full"
              placeholder="Search..."
            />
          </div>
        </div>
      </div>
      
      <div className="flex-1">
        {/* Content would go here based on active tab */}
        <div className="h-40 flex items-center justify-center text-gray-400">
          No {activeTab} found
        </div>
      </div>
    </div>
  )
}

// Leads Overview Component
const LeadsOverview: React.FC = () => {
  return (
    <div className="p-4 flex flex-col w-full">
      <div className="flex items-center gap-2 mb-6">
        <FileBarChart2 size={20} />
        <h3 className="text-lg font-medium">Leads Overview</h3>
      </div>
      
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-blue-400"></div>
          <span className="text-xs text-gray-300">Derinama</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-gray-400"></div>
          <span className="text-xs text-gray-300">Skambinama</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-gray-500"></div>
          <span className="text-xs text-gray-300">Ruošiama sutartis</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-gray-600"></div>
          <span className="text-xs text-gray-300">Laukiama atsatymo</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-orange-500"></div>
          <span className="text-xs text-gray-300">Prarasta</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-green-400"></div>
          <span className="text-xs text-gray-300">Klientas</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-red-500"></div>
          <span className="text-xs text-gray-300">Lost Leads</span>
        </div>
      </div>
      
      <div className="h-40 mt-4">
        {/* Chart would go here */}
        <div className="h-full flex items-center justify-center text-gray-400">
          No leads data available
        </div>
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
    <div className="flex-1 pl-[22vw] pr-4 pb-10">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={widgets.map(w => w.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-6">
            {widgets.map((widget) => {
              if (widget.type === 'metrics') {
                return (
                  <DraggableWidget key={widget.id} id={widget.id} title={widget.title}>
                    <div className="grid grid-cols-3 gap-4 p-4">
                      <MetricCard 
                        icon={<TrendingUp size={18} />} 
                        title="Converted Leads" 
                        startValue={0}
                        endValue={100}
                      />
                      <MetricCard 
                        icon={<BarChart3 size={18} />} 
                        title="Projects in Progress" 
                        startValue={0}
                        endValue={100}
                      />
                      <MetricCard 
                        icon={<BarChart3 size={18} />} 
                        title="Tasks Not Finished" 
                        startValue={0}
                        endValue={100}
                      />
                    </div>
                  </DraggableWidget>
                )
              } else if (widget.type === 'todo') {
                return (
                  <DraggableWidget key={widget.id} id={widget.id} title={widget.title}>
                    <TodoSection />
                  </DraggableWidget>
                )
              } else if (widget.type === 'tabbed') {
                return (
                  <DraggableWidget key={widget.id} id={widget.id} title={widget.title}>
                    <TabbedSection />
                  </DraggableWidget>
                )
              } else if (widget.type === 'leads') {
                return (
                  <DraggableWidget key={widget.id} id={widget.id} title={widget.title}>
                    <LeadsOverview />
                  </DraggableWidget>
                )
              }
              return null
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}