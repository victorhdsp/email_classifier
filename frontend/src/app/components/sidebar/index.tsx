import { useState, useMemo } from 'react';
import { EmailResult } from '../../types';
import styles from './EmailSidebar.module.scss';
import SidebarToggleButton from './SidebarAttributes/SidebarToggleButton';
import SidebarHeader from './SidebarAttributes/SidebarHeader';
import NoResultsDisplay from './SidebarResult/NoResultsDisplay';
import ResultItem from './SidebarResult/ResultItem';
import * as Accordion from '@radix-ui/react-accordion';
import FilterAndSearch from './FilterAndSearch';

interface EmailSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  results: EmailResult[];
  onRemoveResult: (id: string) => void;
}

function EmailSidebar({ sidebarOpen, setSidebarOpen, results, onRemoveResult }: EmailSidebarProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'Produtivo' | 'Improdutivo'>('all');

  const filteredResults = useMemo(() => {
    let filtered = results;

    if (filterType !== 'all') {
      filtered = filtered.filter(result => result.type === filterType);
    }

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        result =>
          result.subject.toLowerCase().includes(lowerCaseSearchTerm) ||
          result.text.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    return filtered;
  }, [results, searchTerm, filterType]);

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
          <SidebarHeader resultsCount={filteredResults.length} />

          <FilterAndSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterType={filterType}
            setFilterType={setFilterType}
          />

          <div className={styles.resultsContainer}>
            {filteredResults.length === 0 ? (
              <NoResultsDisplay />
            ) : (
              <Accordion.Root type="single" collapsible className={styles.resultsList}>
                {filteredResults.map((result) => (
                  <ResultItem
                    key={result.id}
                    result={result}
                    onRemove={onRemoveResult}
                  />
                ))}
              </Accordion.Root>
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
