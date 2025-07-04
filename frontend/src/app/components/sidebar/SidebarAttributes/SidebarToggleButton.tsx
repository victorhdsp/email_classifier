import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import styles from './SidebarAttributes.module.scss';

interface SidebarToggleButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  hasResults: boolean;
}

function SidebarToggleButton({ sidebarOpen, setSidebarOpen, hasResults, ...rest }: SidebarToggleButtonProps) {
  return (
    <button
      {...rest}
      onClick={() => setSidebarOpen(!sidebarOpen)}
      className={styles.sidebarToggleButton}
      data-open={sidebarOpen}
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
