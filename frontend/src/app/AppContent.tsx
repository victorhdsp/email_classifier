import { useState, useEffect, useCallback } from 'react';
import EmailForm from './components/form';
import EmailSidebar from './components/sidebar';
import { EmailResult } from './types';
import styles from './App.module.scss';
import tourStyles from './components/shared/tour/Tour.module.scss';
import { useToast } from './components/shared/Toast/context';
import { useTour } from '@reactour/tour';
import { HelpCircle } from 'lucide-react';
import { useSidebarState } from './components/sidebar/useSidebarState';

const LOCAL_STORAGE_KEY = 'email_classification_results';

function AppContent() {
  const { setSidebarOpen, sidebarOpen } = useSidebarState();
  const [results, setResults] = useState<EmailResult[]>(() => {
    try {
      const storedResults = localStorage.getItem(LOCAL_STORAGE_KEY);
      return storedResults ? JSON.parse(storedResults) : [];
    } catch (error) {
      console.error("Failed to parse stored results:", error);
      return [];
    }
  });
  const toast = useToast();
  const { setIsOpen } = useTour();

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setIsOpen(true);
      localStorage.setItem('hasSeenTour', 'true');
    }
  }, [setIsOpen]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(results));
    } catch (error) {
      console.error("Failed to save results to local storage:", error);
    }
  }, [results]);

  const handleEmailClassified = useCallback((newResult: EmailResult) => {
    setResults(prev => {
      const updatedResults = [newResult, ...prev];
      // Sort by timestamp in descending order (newest first)
      return updatedResults.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    });
    setSidebarOpen(true);

    toast.showToast({
      title: 'E-mail classificado com sucesso!',
      description: `O e-mail foi classificado como ${newResult.type}.`,
      variant: 'success'
    });
  }, [setSidebarOpen, toast]);

  const handleRemoveResult = useCallback((id: string) => {
    setResults(prev => prev.filter(result => result.id !== id));
    toast.showToast({
      title: 'Resultado removido',
      description: 'A classificação foi removida do histórico.',
      variant: 'success'
    });
  }, [toast]);

  return (
    <div className={styles.appContainer}>
      {/* Main Content Container */}
      <div data-sidebar-open={sidebarOpen} className={styles.mainContentContainer}>
        <div className={styles.maxWidthContainer}>
          <EmailForm
            onEmailClassified={handleEmailClassified}
          />
        </div>
      </div>

      <EmailSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        results={results}
        onRemoveResult={handleRemoveResult}
      />
      <button className={tourStyles.tourButton} onClick={() => setIsOpen(true)}>
        <HelpCircle size={24} />
      </button>
    </div>
  );
}

export default AppContent;
