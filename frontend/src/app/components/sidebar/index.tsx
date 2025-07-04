import { useState } from 'react';
import { EmailResult } from '../../types';
import styles from './EmailSidebar.module.scss';
import SidebarToggleButton from './SidebarAttributes/SidebarToggleButton';
import SidebarHeader from './SidebarAttributes/SidebarHeader';
import NoResultsDisplay from './SidebarResult/NoResultsDisplay';
import ResultItem from './SidebarResult/ResultItem';

interface EmailSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  results: EmailResult[];
}

function EmailSidebar({ sidebarOpen, setSidebarOpen, results }: EmailSidebarProps) {
  const [expandedResult, setExpandedResult] = useState<string | null>(results.length > 0 ? results[0].id : null);

  return (
    <>
      <SidebarToggleButton
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        hasResults={results.length > 0}
        data-tour="sidebar-toggle-button"
      />

      <div
        data-open={sidebarOpen}
        className={styles.sidebarContainer}
        data-tour="sidebar-results"
      >
        <div className={styles.sidebarContent}>
          <SidebarHeader resultsCount={results.length} />

          <div className={styles.resultsContainer}>
            {results.length === 0 ? (
              <NoResultsDisplay />
            ) : (
              <div className={styles.resultsList}>
                {results.map((result) => (
                  <ResultItem
                    key={result.id}
                    result={result}
                    isExpanded={expandedResult === result.id}
                    onToggleExpand={() => setExpandedResult(expandedResult === result.id ? null : result.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className={styles.mobileOverlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}

export default EmailSidebar;
