import { useState, useMemo } from 'react'
import { EmailResult } from '../../shared/components/views/AppContent/types'
import styles from './EmailSidebar.module.scss'
import { SidebarToggleButton } from '@/app/sidebar/components/SidebarToggleButton'
import { NoResultsDisplay } from '@/app/sidebar/components/container/NoResultsDisplay'
import { ResultDisplayItem } from '@/app/sidebar/components/container/ResultDisplayItem'
import { SidebarHeader } from '@/app/sidebar/components/container/SidebarHeader'
import * as Accordion from '@radix-ui/react-accordion'
import { FilterAndSearch } from '@/app/sidebar/components/container/FilterAndSearch'

interface EmailSidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  results: EmailResult[]
  onRemoveResult: (id: string) => void
}

function EmailSidebar({ sidebarOpen, setSidebarOpen, results, onRemoveResult }: EmailSidebarProps) {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filterType, setFilterType] = useState<'all' | 'Produtivo' | 'Improdutivo'>('all')

  const filteredResults = useMemo(() => {
    let filtered = results

    if (filterType !== 'all') {
      filtered = filtered.filter((result) => result.type === filterType)
    }

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (result) =>
          result.subject.toLowerCase().includes(lowerCaseSearchTerm) ||
          result.text.toLowerCase().includes(lowerCaseSearchTerm),
      )
    }

    return filtered
  }, [results, searchTerm, filterType])

  return (
    <>
      <SidebarToggleButton
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        hasResults={results.length > 0}
        data-tour="sidebar-toggle-button"
      />

      <div data-open={sidebarOpen} className={styles.sidebarContainer} data-tour="sidebar-results">
        <div className={styles.sidebarContent}>
          <SidebarHeader resultsCount={filteredResults.length} />

          <FilterAndSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterType={filterType}
            setFilterType={setFilterType}
          />

          <div className={styles.resultsContainer}>
            {filteredResults.length === 0 ? (
              <NoResultsDisplay />
            ) : (
              <Accordion.Root
                type="single"
                collapsible
                defaultValue={results[0]?.id}
                className={styles.resultsList}
              >
                {filteredResults.map((result) => (
                  <ResultDisplayItem key={result.id} result={result} onRemove={onRemoveResult} />
                ))}
              </Accordion.Root>
            )}
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setSidebarOpen(false)
            }
          }}
        />
      )}
    </>
  )
}

export default EmailSidebar
