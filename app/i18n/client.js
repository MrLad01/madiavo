'use client'

import i18next from './i18next'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const runsOnServerSide = typeof window === 'undefined'

export function useT(ns, options) {
  const lng = useParams()?.lng
  
  // Always call hooks at the top level
  const [activeLng, setActiveLng] = useState(i18next.resolvedLanguage)
  const translation = useTranslation(ns, options)
  
  if (typeof lng !== 'string') {
    throw new Error('useT is only available inside /app/[lng]')
  }

  // Handle server-side language change
  useEffect(() => {
    if (runsOnServerSide && i18next.resolvedLanguage !== lng) {
      i18next.changeLanguage(lng)
    }
  }, [lng])

  // Handle client-side language state tracking
  useEffect(() => {
    if (!runsOnServerSide && activeLng !== i18next.resolvedLanguage) {
      setActiveLng(i18next.resolvedLanguage)
    }
  }, [activeLng])

  // Handle client-side language change
  useEffect(() => {
    if (!runsOnServerSide && lng && i18next.resolvedLanguage !== lng) {
      i18next.changeLanguage(lng)
    }
  }, [lng])

  return translation
}