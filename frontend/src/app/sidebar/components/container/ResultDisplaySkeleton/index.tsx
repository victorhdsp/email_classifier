import { ChevronRight, Clock, Tag, X } from 'lucide-react'
import { EmailLoadingResult } from '../../../../shared/components/views/AppContent/types'
import styles from './Item.module.scss'
import * as Accordion from '@radix-ui/react-accordion'
import { GenericSkeleton } from './GenericSkeleton'

interface ResultItemProps {
  result: EmailLoadingResult
  onRemove: (id: string) => void
}

export function ResultDisplaySkeleton({ result, onRemove }: ResultItemProps) {
  return (
    <Accordion.Item value={result.id} className={styles.resultItem}>
      <Accordion.Trigger asChild>
        <div className={styles.resultButton}>
          <div className={styles.resultHeader}>
            <div className={styles.resultSubjectContainer}>
              <GenericSkeleton className={styles.resultSubjectSkeleton} />
              <div className={styles.resultTypeContainer}>
                <span className={styles.resultType}>
                  <Tag className={styles.resultTypeIcon} />
                  <GenericSkeleton className={styles.resultTypeSkeleton} />
                </span>
              </div>
            </div>
            <div className={styles.resultActions}>
              <Clock className={styles.resultActionIcon} />
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
          <GenericSkeleton className={styles.expandedContentTextSkeleton} />
        </div>
        <div>
          <p className={styles.expandedContentTitle}>Data</p>
          <GenericSkeleton className={styles.expandedContentTimestampSkeleton} />
        </div>
      </Accordion.Content>
    </Accordion.Item>
  )
}
