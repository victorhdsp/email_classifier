import React from 'react';
import { ChevronRight, Clock, Tag } from 'lucide-react';
import { EmailResult } from '../../../types';
import styles from './SidebarResult.module.css';

interface ResultItemProps {
  result: EmailResult;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
}

function ResultItem({ result, isExpanded, onToggleExpand }: ResultItemProps) {
  return (
    <div key={result.id} className={styles.resultItem}>
      <button
        onClick={() => onToggleExpand(result.id)}
        className={styles.resultButton}
      >
        <div className={styles.resultHeader}>
          <div className={styles.resultSubjectContainer}>
            <p className={styles.resultSubject}>{result.subject}</p>
            <div className={styles.resultTypeContainer}>
              <span className={`${styles.resultType} ${
                result.type === 'Produtivo' 
                  ? styles.resultTypeProductive 
                  : styles.resultTypeImproductive
              }`}>
                <Tag className={styles.resultTypeIcon} />
                {result.type}
              </span>
            </div>
          </div>
          <div className={styles.resultActions}>
            <Clock className={styles.resultActionIcon} />
            <ChevronRight className={`${styles.resultChevron} ${
              isExpanded ? styles.resultChevronExpanded : ''
            }`} />
          </div>
        </div>
      </button>
      
      {isExpanded && (
        <div className={styles.expandedContent}>
          <div>
            <p className={styles.expandedContentTitle}>Conteúdo</p>
            <p className={styles.expandedContentText}>{result.text}</p>
          </div>
          <div>
            <p className={styles.expandedContentTitle}>Timestamp</p>
            <p className={styles.expandedContentText}>{result.timestamp}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultItem;
