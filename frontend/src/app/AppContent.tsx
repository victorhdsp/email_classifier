import { useState, useEffect } from 'react';
import EmailForm from './components/form';
import EmailSidebar from './components/sidebar';
import { EmailResult } from './types';
import styles from './App.module.scss';
import tourStyles from './components/shared/tour/Tour.module.scss';
import { useToast } from './components/shared/Toast/context';
import { useTour } from '@reactour/tour';
import { HelpCircle } from 'lucide-react';
import { useSidebarState } from './components/sidebar/useSidebarState';

function AppContent() {
  const { setSidebarOpen, sidebarOpen } = useSidebarState();
  const [results, setResults] = useState<EmailResult[]>([]);
  const toast = useToast();
  const { setIsOpen } = useTour();

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setIsOpen(true);
      localStorage.setItem('hasSeenTour', 'true');
    }
  }, [setIsOpen]);

  const handleEmailClassified = (newResult: EmailResult) => {
    setResults(prev => [newResult, ...prev]);
    setSidebarOpen(true);

    toast.showToast({
      title: 'E-mail classificado com sucesso!',
      description: `O e-mail foi classificado como ${newResult.type}.`,
      variant: 'success'
    })
  };

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
      />
      <button className={tourStyles.tourButton} onClick={() => setIsOpen(true)}>
        <HelpCircle size={24} />
      </button>
    </div>
  );
}

export default AppContent;
