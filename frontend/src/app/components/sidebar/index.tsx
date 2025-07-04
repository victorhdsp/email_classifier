import { useState, useMemo } from 'react';
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
  onRemoveResult: (id: string) => void;
}

function EmailSidebar({ sidebarOpen, setSidebarOpen, results, onRemoveResult }: EmailSidebarProps) {
  const [expandedResult, setExpandedResult] = useState<string | null>(results.length > 0 ? results[0].id : null);
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

          <div className={styles.filterContainer}>
            <input
              type="text"
              placeholder="Buscar por assunto ou conteúdo..."
              className={styles.searchBar}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className={styles.filterSelect}
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'Produtivo' | 'Improdutivo')}
            >
              <option value="all">Todos os Tipos</option>
              <option value="Produtivo">Produtivo</option>
              <option value="Improdutivo">Improdutivo</option>
            </select>
          </div>

          <div className={styles.resultsContainer}>
            {filteredResults.length === 0 ? (
              <NoResultsDisplay />
            ) : (
              <div className={styles.resultsList}>
                {filteredResults.map((result) => (
                  <ResultItem
                    key={result.id}
                    result={result}
                    isExpanded={expandedResult === result.id}
                    onToggleExpand={() => setExpandedResult(expandedResult === result.id ? null : result.id)}
                    onRemove={onRemoveResult}
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
