import React from 'react';
import styles from './SidebarAttributes.module.css';

interface SidebarHeaderProps {
  resultsCount: number;
}

function SidebarHeader({ resultsCount }: SidebarHeaderProps) {
  return (
    <div className={styles.sidebarHeader}>
      <h3 className={styles.sidebarTitle}>Resultados</h3>
      <p className={styles.sidebarSubtitle}>
        {resultsCount} classificaç{resultsCount === 1 ? 'ão' : 'ões'}
      </p>
    </div>
  );
}

export default SidebarHeader;
