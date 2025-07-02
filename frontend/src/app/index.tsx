import React, { useState } from 'react';
import EmailForm from './components/form/EmailForm';
import EmailSidebar from './components/sidebar/EmailSidebar';
import { EmailResult } from './types';
import styles from './App.module.css';

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [results, setResults] = useState<EmailResult[]>([]);
  const [expandedResult, setExpandedResult] = useState<string | null>(null);

  const handleEmailClassified = (newResult: EmailResult) => {
    setResults(prev => [newResult, ...prev]);
    setSidebarOpen(true);
  };

  return (
    <div className={styles.appContainer}>
      <EmailSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        results={results}
        expandedResult={expandedResult}
        setExpandedResult={setExpandedResult}
      />

      {/* Main Content Container */}
      <div className={`${styles.mainContentContainer} ${
        sidebarOpen ? styles.mainContentContainerSidebarOpen : ''
      }`}>
        <div className={styles.maxWidthContainer}>
          <EmailForm
            onEmailClassified={handleEmailClassified}
            setIsProcessing={setIsProcessing}
            isProcessing={isProcessing}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
