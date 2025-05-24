'use client'

import { useState, useEffect, useRef } from 'react'
import { Clock4, Trash2 } from 'lucide-react'
import { formatTime } from './utils'

export default function TimesheetDropdown({ isAdmin = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const [timerActive, setTimerActive] = useState(false)
  const [timerStarted, setTimerStarted] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [timerStartTime, setTimerStartTime] = useState<Date | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const dropdownRef = useRef<HTMLDivElement>(null);

  console.log(currentTime);
  
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
      console.log(currentTime);
      
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Timer functionality
  useEffect(() => {
    let interval = null
    
    if (timerActive) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1)
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timerActive])

  // Update current time every second
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    
    return () => clearInterval(timeInterval)
  }, [])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '.')
  }
  
  const formatCurrentTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleTimerToggle = () => {
    if (!timerStarted) {
      // Start timer for the first time
      setTimerStarted(true)
      setTimerActive(true)
      setTimerStartTime(new Date())
    } else {
      // Pause/continue the timer
      setTimerActive(!timerActive)
    }
  }

  const handleDeleteTimer = () => {
    if (confirm('Are you sure you want to delete this timer?')) {
      setTimerStarted(false)
      setTimerActive(false)
      setSeconds(0)
      setTimerStartTime(null)
    }
  }

  const handleStopTimer = () => {
    setIsOpen(false)
    // In a real app, this would open the stop timer modal
    console.log('Open stop timer modal')
  }

  const viewAllTimesheets = () => {
    console.log('Navigate to view all timesheets')
    setIsOpen(false)
    // In a real app, this would navigate to the timesheets page
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="cursor-pointer outline-none flex items-center justify-center" 
        title="My Timesheets"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={`${timerActive ? 'animate-spin' : ''}`}>
          <Clock4 size={18} className="text-indigo-600 dark:text-white" />
        </div>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-4">
            {!timerStarted ? (
              <>
                <div className="flex justify-center items-center p-4">
                  <div className="text-center">
                    <div className="text-gray-500 dark:text-gray-300 mb-2">No started timers found</div>
                    <button 
                      onClick={handleTimerToggle}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm font-medium"
                    >
                      Start Timer
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-md mb-3">
                  <div className="text-green-600 dark:text-green-400 text-sm">
                    Started at {timerStartTime ? formatDate(timerStartTime) : 'N/A'} {timerStartTime ? formatCurrentTime(timerStartTime) : ''}
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <div className="text-gray-700 dark:text-gray-300">
                      Total logged time: {formatTime(seconds)}
                    </div>
                    <button 
                      onClick={handleDeleteTimer}
                      className="text-red-500 hover:text-red-700 dark:hover:text-red-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <button 
                  onClick={timerActive ? handleTimerToggle : handleTimerToggle}
                  className={`w-full ${timerActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white py-2 px-4 rounded-md text-sm font-medium mb-2`}
                >
                  {timerActive ? 'Pause Timer' : 'Continue Timer'}
                </button>
                <button 
                  onClick={handleStopTimer}
                  className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-white py-2 px-4 rounded-md text-sm font-medium"
                >
                  Stop Timer
                </button>
              </>
            )}
            
            {isAdmin && (
              <div className="mt-3 pt-3 border-t dark:border-gray-700">
                <button 
                  onClick={viewAllTimesheets}
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium"
                >
                  View all timesheets
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}