import React from 'react';
import { ChevronRight, Clock, Tag } from 'lucide-react';
import { EmailResult } from '../../../types';
import styles from './SidebarResult.module.css';
import { getLocaleDateByString } from '../../../../shared/utils/date';

interface ResultItemProps {
  result: EmailResult;
  isExpanded: boolean;
}

function ResultItem({ result, isExpanded }: ResultItemProps) {
  const [expanded, setExpanded] = React.useState(isExpanded);

  return (
    <div key={result.id} className={styles.resultItem}>
      <button
        onClick={() => setExpanded(!expanded)}
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
              expanded ? styles.resultChevronExpanded : ''
            }`} />
          </div>
        </div>
      </button>
      
      {expanded && (
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
