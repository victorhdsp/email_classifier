import React from 'react';
import { ChevronRight, Clock, Tag, X } from 'lucide-react';
import { EmailResult } from '../../../types';
import styles from './SidebarResult.module.scss';
import { getLocaleDateByString } from '../../../../shared/utils/date';

interface ResultItemProps {
  result: EmailResult;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onRemove: (id: string) => void;
}

function ResultItem({ result, isExpanded, onToggleExpand, onRemove }: ResultItemProps) {
  return (
    <div key={result.id} className={styles.resultItem}>
      <button
        onClick={onToggleExpand}
        className={styles.resultButton}
      >
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
            <Clock className={styles.resultActionIcon} />
            <ChevronRight data-expanded={isExpanded} className={styles.resultChevron} />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(result.id);
              }}
              className={styles.removeButton}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </button>
      
      {isExpanded && (
        <div className={styles.expandedContent}>
          <div>
            <p className={styles.expandedContentTitle}>Conteúdo</p>
            <p className={styles.expandedContentText}>{result.text}</p>
          </div>
          { result.timestamp && (
            <div>
              <p className={styles.expandedContentTitle}>Data</p>
              <p className={styles.expandedContentText}>
                {getLocaleDateByString(result.timestamp)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ResultItem;
