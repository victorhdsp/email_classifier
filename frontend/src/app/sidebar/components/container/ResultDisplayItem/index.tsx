import { ChevronRight, Tag, X } from 'lucide-react'
import { EmailResult } from '../../../../shared/components/views/AppContent/types'
import styles from './Item.module.scss'
import { getLocaleDateByString } from '../../../../shared/utils/date'
import * as Accordion from '@radix-ui/react-accordion'

interface ResultItemProps {
  result: EmailResult
  onRemove: (id: string) => void
}

export function ResultDisplayItem({ result, onRemove }: ResultItemProps) {
  return (
    <Accordion.Item value={result.id} className={styles.resultItem}>
      <Accordion.Trigger asChild>
        <div className={styles.resultButton}>
          <div className={styles.resultHeader}>
            <div className={styles.resultSubjectContainer}>
              <p className={styles.resultSubject}>{result.subject}</p>
              <div className={styles.resultTypeContainer}>
                <span data-type={result.type} className={styles.resultType}>
                  <Tag className={styles.resultTypeIcon} />
                  {result.type}
                </span>
              </div>
            </div>
            <div className={styles.resultActions}>
              <ChevronRight className={styles.resultChevron} />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove(result.id)
                }}
                className={styles.removeButton}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Accordion.Trigger>

      <Accordion.Content className={styles.expandedContent}>
        <div>
          <p className={styles.expandedContentTitle}>Conteúdo</p>
          <p className={styles.expandedContentText}>{result.text}</p>
        </div>
        {result.timestamp && (
          <div>
            <p className={styles.expandedContentTitle}>Data</p>
            <p className={styles.expandedContentText}>{getLocaleDateByString(result.timestamp)}</p>
          </div>
        )}
      </Accordion.Content>
    </Accordion.Item>
  )
}
