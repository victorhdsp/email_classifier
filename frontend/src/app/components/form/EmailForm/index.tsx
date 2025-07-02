import React, { useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import FileUploadSection from '../FileUploadSection';
import TextInputSection from '../TextInputSection';
import SubmitButton from '../SubmitButton';
import styles from './EmailForm.module.css';
import { EmailResult, UploadedFile } from '../../../types';

interface EmailFormProps {
  onEmailClassified: (result: EmailResult) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  isProcessing: boolean;
}

function EmailForm({ onEmailClassified, setIsProcessing, isProcessing }: EmailFormProps) {
  const [uploadMode, setUploadMode] = useState<'file' | 'text'>('file');
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
  };

  const canSubmit = uploadMode === 'file' ? uploadedFile && !isUploading : textInput.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <Tabs.Root className="flex flex-col" value={uploadMode} onValueChange={(value) => setUploadMode(value as 'file' | 'text')}>
        <div className={styles.modeToggleContainer}>
          <Tabs.List className={styles.tabsList}>
            <Tabs.Trigger
              value="file"
              className={`${styles.tabTrigger} ${
                uploadMode === 'file' 
                  ? styles.tabTriggerActive 
                  : styles.tabTriggerInactive
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Arquivo</span>
            </Tabs.Trigger>
            <Tabs.Trigger
              value="text"
              className={`${styles.tabTrigger} ${
                uploadMode === 'text' 
                  ? styles.tabTriggerActive 
                  : styles.tabTriggerInactive
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Texto</span>
            </Tabs.Trigger>
          </Tabs.List>
        </div>

        <Tabs.Content value="file">
          <FileUploadSection
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            isUploading={isUploading}
            setIsUploading={setIsUploading}
          />
        </Tabs.Content>

        <Tabs.Content value="text">
          <TextInputSection
            textInput={textInput}
            setTextInput={setTextInput}
          />
        </Tabs.Content>
      </Tabs.Root>

      <SubmitButton
        canSubmit={canSubmit}
        isProcessing={isProcessing}
      />
    </form>
  );
}

export default EmailForm;