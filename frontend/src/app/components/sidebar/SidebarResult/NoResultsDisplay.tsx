import React from 'react';
import { Mail } from 'lucide-react';
import styles from './SidebarResult.module.scss';

function NoResultsDisplay() {
  return (
    <div className={styles.noResultsContainer}>
      <div className={styles.noResultsIconContainer}>
        <Mail className={styles.noResultsIcon} />
      </div>
      <p className={styles.noResultsText}>Nenhuma classificação</p>
      <p className={styles.noResultsSubText}>Envie um email para ver os resultados</p>
    </div>
  );
}

export default NoResultsDisplay;
