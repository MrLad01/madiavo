'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface StopTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { task: string; note: string }) => void;
}

export default function StopTimerModal({ isOpen, onClose, onConfirm }: StopTimerModalProps) {
  const [selectedTask, setSelectedTask] = useState('')
  const [note, setNote] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  
  // Mock tasks for demonstration
  const tasks = [
    { id: 1, name: 'CARTS' },
    { id: 2, name: 'Support Tickets' },
    { id: 3, name: 'Email Campaign' },
    { id: 4, name: 'Website Redesign' }
  ]
  
  const handleSubmit = (e: React.FormEvent) => {
    if (e) e.preventDefault()
    onConfirm({
      task: selectedTask,
      note
    })
    setSelectedTask('')
    setNote('')
    onClose()
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-[#00000094] bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md relative">
        <div className="absolute top-4 right-4">
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Stop Timer
          </h3>
          
          <div>
            <div className="mb-4 relative">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-left text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {selectedTask ? selectedTask : 'Search Tasks'}
                </button>
                {isSearchOpen && (
                  <div className="absolute mt-1 w-full z-10 bg-white dark:bg-gray-700 shadow-lg rounded-md border border-gray-200 dark:border-gray-600 max-h-60 overflow-auto">
                    {tasks.map(task => (
                      <div 
                        key={task.id}
                        className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                        onClick={() => {
                          setSelectedTask(task.name)
                          setIsSearchOpen(false)
                        }}
                      >
                        {task.name}
                      </div>
                    ))}
                  </div>
                )}
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <button
                    type="button"
                    className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Note"
                className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                rows={4}
              />
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-medium text-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}