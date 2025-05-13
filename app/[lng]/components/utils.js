'use client'

/**
 * Formats seconds into a readable time format (HH:MM:SS)
 * @param {number} totalSeconds - The total number of seconds to format
 * @returns {string} - Formatted time string
 */
export function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  
  const formatNumber = (num) => num.toString().padStart(2, '0')
  
  return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`
}

/**
 * Gets the current day in format DD.MM.YYYY
 * @returns {string} - Current date string
 */
export function getCurrentDate() {
  const now = new Date()
  const day = String(now.getDate()).padStart(2, '0')
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const year = now.getFullYear()
  
  return `${day}.${month}.${year}`
}

/**
 * Calculates the difference between two dates in seconds
 * @param {Date} startTime - The start time
 * @param {Date} endTime - The end time (defaults to current time if not provided)
 * @returns {number} - Time difference in seconds
 */
export function getTimeDifferenceInSeconds(startTime, endTime = new Date()) {
  if (!startTime) return 0
  
  const diff = Math.floor((endTime.getTime() - startTime.getTime()) / 1000)
  return diff > 0 ? diff : 0
}