import { useCallback } from 'react'
import EmailForm from '../../../../form/components'
import EmailSidebar from '../../../../sidebar/components'
import { EmailLoadingResult } from './types'
import styles from './App.module.scss'
import { HelpCircle } from 'lucide-react'
import { useSidebarState } from '../../../../sidebar/hooks/useSidebarState'
import { useTour } from '@reactour/tour'
import { useResultServiceStore } from '@/app/shared/store/useResultServiceStore'

function AppContent() {
  const { setIsOpen } = useTour()
  //const { results, addResult, removeResult } = useResults()
  const results = useResultServiceStore((state) => state.results)
  const addLoadingResult = useResultServiceStore((state) => state.addLoadingResult)
  const removeResult = useResultServiceStore((state) => state.removeResult)
  const { setSidebarOpen, sidebarOpen } = useSidebarState()

  const handleEmailClassified = useCallback(
    (newResult: EmailLoadingResult) => {
      addLoadingResult(newResult)
      setSidebarOpen(true)
    },
    [addLoadingResult, setSidebarOpen],
  )

  const handleRemoveResult = useCallback((id: string) => removeResult(id), [removeResult])

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
