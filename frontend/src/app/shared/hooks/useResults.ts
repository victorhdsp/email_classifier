import { EmailResult } from '@/app/shared/components/views/AppContent/types'
import { useEffect, useState } from 'react'
import { useToast } from '../components/providers/Toast/context'
import { logger } from '../utils/logger'

const LOCAL_STORAGE_KEY = 'email_classification_results'

export function useResults() {
  const toast = useToast()
  const [results, setResults] = useState<EmailResult[]>(() => {
    try {
      const storedResults = localStorage.getItem(LOCAL_STORAGE_KEY)
      return storedResults ? JSON.parse(storedResults) : []
    } catch (error) {
      logger.error('Failed to parse stored results:', error)
      return []
    }
  })

  function addResult(result: EmailResult) {
    if (results.some((r) => r.id === result.id)) return
    setResults((prevResults) => [...prevResults, result])

    toast.showToast({
      title: 'E-mail classificado com sucesso!',
      description: `O e-mail foi classificado como ${result.type}.`,
      variant: 'success',
    })
  }

  function removeResult(id: string) {
    setResults((prev) => prev.filter((result) => result.id !== id))

    toast.showToast({
      title: 'Resultado removido',
      description: 'A classificação foi removida do histórico.',
      variant: 'success',
    })
  }

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(results))
    } catch (error) {
      logger.error('Failed to save results to local storage:', error)
    }
  }, [results])

  return {
    results,
    addResult,
    removeResult,
  }
}
