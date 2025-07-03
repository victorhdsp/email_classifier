import React from 'react';
import { Upload, FileText } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import FileUploadSection from '../FileUploadSection';
import TextInputSection from '../TextInputSection';
import SubmitButton from '../SubmitButton';
import styles from './EmailForm.module.css';
import { EmailResult } from '../../../types';
import FilePreview from '../../shared/GenericLoadingMessage';
import { useSendEmailForm } from './useSendEmailForm';
import { ButtonToggle } from './ButtonToggle';

interface EmailFormProps {
  onEmailClassified: (result: EmailResult) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  isProcessing: boolean;
}

function EmailForm({ onEmailClassified, setIsProcessing, isProcessing }: EmailFormProps) {
  const { 
    isUploading,
    uploadedFile,
    setUploadedFile,
    setUploadMode,
    uploadMode,
    textInput,
    setTextInput,
    sendSubmit 
  } = useSendEmailForm(setIsProcessing);
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await sendSubmit();
    if (!result) return;
    onEmailClassified(result)
  };

  const canSubmit = (uploadMode === 'file' ?
                      uploadedFile && !isUploading :
                      textInput.trim().length > 0) || false;

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <Tabs.Root 
        className="flex flex-col"
        value={uploadMode}
        onValueChange={(value) => setUploadMode(value as 'file' | 'text')}
      >
        <div className={styles.modeToggleContainer}>
          <Tabs.List className={styles.tabsList}>
            <ButtonToggle
              value='file'
              text='Arquivo'
              Icon={Upload}
            />
            <ButtonToggle
              value='text'
              text='Texto'
              Icon={FileText}
            />
          </Tabs.List>
        </div>

        <Tabs.Content value="file">
          <FileUploadSection
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            isUploading={isUploading}
          />
        </Tabs.Content>

        <Tabs.Content value="text">
          <TextInputSection
            textInput={textInput}
            setTextInput={setTextInput}
          />
        </Tabs.Content>
      </Tabs.Root>

      {uploadedFile && (
        <FilePreview
          title={uploadedFile.name}
          subtitle={`Tamanho: ${uploadedFile.size}`}
          status={isUploading ? 'progress' : 'idle'}
          progress={uploadedFile.progress}
          onRemove={() => setUploadedFile(null)}
        />
      )}

      <SubmitButton
        canSubmit={canSubmit}
        isProcessing={isProcessing}
      />
    </form>
  );
}

export default EmailForm;