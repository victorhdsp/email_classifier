import { useState } from 'react';
import EmailForm from './components/form';
import EmailSidebar from './components/sidebar';
import { EmailResult } from './types';
import styles from './App.module.scss';
import { useToast } from './components/shared/Toast/context';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [results, setResults] = useState<EmailResult[]>([]);
  const toast = useToast();

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
    </div>
  );
}

export default App;
