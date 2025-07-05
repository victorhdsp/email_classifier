import { useCallback } from 'react'
import EmailForm from '../../../../form/components'
import EmailSidebar from '../../../../sidebar/components'
import { EmailResult } from './types'
import styles from './App.module.scss'
import { useToast } from '../../providers/Toast/context'
import { HelpCircle } from 'lucide-react'
import { useSidebarState } from '../../../../sidebar/hooks/useSidebarState'
import { useResults } from '../../../hooks/useResults'
import { useTour } from '@reactour/tour'

function AppContent() {
  const toast = useToast()
  const { setIsOpen } = useTour()
  const { results, setResults } = useResults()
  const { setSidebarOpen, sidebarOpen } = useSidebarState()

  const handleEmailClassified = useCallback(
    (newResult: EmailResult) => {
      setResults((prev) => {
        const updatedResults = [newResult, ...prev]
        return updatedResults.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        )
      })
      setSidebarOpen(true)

      toast.showToast({
        title: 'E-mail classificado com sucesso!',
        description: `O e-mail foi classificado como ${newResult.type}.`,
        variant: 'success',
      })
    },
    [setResults, setSidebarOpen, toast],
  )

  const handleRemoveResult = useCallback(
    (id: string) => {
      setResults((prev) => prev.filter((result) => result.id !== id))

      toast.showToast({
        title: 'Resultado removido',
        description: 'A classificação foi removida do histórico.',
        variant: 'success',
      })
    },
    [setResults, toast],
  )

  return (
    <div className={styles.appContainer}>
      <div data-sidebar-open={sidebarOpen} className={styles.mainContentContainer}>
        <div className={styles.maxWidthContainer}>
          <EmailForm onEmailClassified={handleEmailClassified} />
        </div>
      </div>

      <EmailSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        results={results}
        onRemoveResult={handleRemoveResult}
      />

      <button className={styles.tourButton} onClick={() => setIsOpen(true)}>
        <HelpCircle size={24} />
      </button>
    </div>
  )
}

export default AppContent
