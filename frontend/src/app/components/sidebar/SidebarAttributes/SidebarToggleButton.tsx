import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import styles from './SidebarAttributes.module.css';

interface SidebarToggleButtonProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  hasResults: boolean;
}

function SidebarToggleButton({ sidebarOpen, setSidebarOpen, hasResults }: SidebarToggleButtonProps) {
  return (
    <button
      onClick={() => setSidebarOpen(!sidebarOpen)}
      className={`${styles.sidebarToggleButton} ${
        sidebarOpen ? styles.sidebarToggleButtonOpen : styles.sidebarToggleButtonClosed
      }`}
      aria-label="toggle sidebar"
    >
      {sidebarOpen ? (
        <ChevronRight className={styles.sidebarToggleButtonIcon} />
      ) : (
        <div className={styles.sidebarToggleButtonContent}>
          <ChevronLeft className={styles.sidebarToggleButtonIcon} />
          {hasResults && (
            <div className={styles.newResultsIndicator}></div>
          )}
        </div>
      )}
    </button>
  );
}

export default SidebarToggleButton;
