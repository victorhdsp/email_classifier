import { EmailResult } from '@/app/shared/components/views/AppContent/types'
import { useEffect, useState } from 'react'

const LOCAL_STORAGE_KEY = 'email_classification_results'

export function useResults() {
  const [results, setResults] = useState<EmailResult[]>(() => {
    try {
      const storedResults = localStorage.getItem(LOCAL_STORAGE_KEY)
      return storedResults ? JSON.parse(storedResults) : []
    } catch (error) {
      console.error('Failed to parse stored results:', error)
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(results))
    } catch (error) {
      console.error('Failed to save results to local storage:', error)
    }
  }, [results])

  return {
    results,
    setResults,
  }
}
