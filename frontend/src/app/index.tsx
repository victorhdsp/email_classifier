import { useState } from 'react';
import EmailForm from './components/form/EmailForm';
import EmailSidebar from './components/sidebar/EmailSidebar';
import { EmailResult } from './types';
import styles from './App.module.css';
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
      <EmailSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        results={results}
      />

      {/* Main Content Container */}
      <div className={`${styles.mainContentContainer} ${
        sidebarOpen ? styles.mainContentContainerSidebarOpen : ''
      }`}>
        <div className={styles.maxWidthContainer}>
          <EmailForm
            onEmailClassified={handleEmailClassified}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
