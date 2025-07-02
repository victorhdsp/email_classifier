import React from 'react';
import { EmailResult } from '../../../types';
import styles from './EmailSidebar.module.css';
import SidebarToggleButton from '../SidebarAttributes/SidebarToggleButton';
import SidebarHeader from '../SidebarAttributes/SidebarHeader';
import NoResultsDisplay from '../SidebarResult/NoResultsDisplay';
import ResultItem from '../SidebarResult/ResultItem';

interface EmailSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  results: EmailResult[];
  expandedResult: string | null;
  setExpandedResult: (id: string | null) => void;
}

function EmailSidebar({ sidebarOpen, setSidebarOpen, results, expandedResult, setExpandedResult }: EmailSidebarProps) {
  return (
    <>
      <SidebarToggleButton
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        hasResults={results.length > 0}
      />

      <div className={`${styles.sidebarContainer} ${
        sidebarOpen ? styles.sidebarContainerOpen : styles.sidebarContainerClosed
      }`}>
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
                    onToggleExpand={setExpandedResult}
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
