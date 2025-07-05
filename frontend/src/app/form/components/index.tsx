import React from 'react'
import { Upload, FileText } from 'lucide-react'
import * as Tabs from '@radix-ui/react-tabs'
import FileUploadSection from './Tabs/FileUploadSection'
import TextInputSection from './Tabs/TextInputSection'
import SubmitButton from './SubmitButton'
import styles from './EmailForm.module.scss'
import { EmailResult } from '../../shared/components/views/AppContent/types'
import { FilePreview } from './FilePreview'
import { useSendEmailForm } from '../hooks/useSendEmailForm'
import { ButtonToggle } from './Tabs/ButtonToggle'

interface EmailFormProps {
  onEmailClassified: (result: EmailResult) => void
}

function EmailForm({ onEmailClassified }: EmailFormProps) {
  const {
    isSubmitting,
    uploadedFile,
    setUploadedFile,
    uploadMode,
    setUploadMode,
    textInput,
    setTextInput,
    handleSubmit: sendSubmit,
  } = useSendEmailForm()

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const result = await sendSubmit()
    if (result) {
      onEmailClassified(result)
    }
  }

  const canSubmit =
    (uploadMode === 'file' ? !!uploadedFile : textInput.trim().length > 0) && !isSubmitting

  return (
    <form onSubmit={handleFormSubmit} className={styles.formContainer} data-tour="email-form">
      <Tabs.Root
        className="flex flex-col"
        value={uploadMode}
        onValueChange={(value) => setUploadMode(value as 'file' | 'text')}
      >
        <div className={styles.modeToggleContainer}>
          <Tabs.List className={styles.tabsList}>
            <ButtonToggle
              value="file"
              text="Arquivo"
              Icon={Upload}
              data-tour="file-upload-toggle"
            />
            <ButtonToggle value="text" text="Texto" Icon={FileText} data-tour="text-input-toggle" />
          </Tabs.List>
        </div>

        <Tabs.Content value="file">
          <FileUploadSection
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            isUploading={isSubmitting}
          />
        </Tabs.Content>

        <Tabs.Content value="text">
          <TextInputSection textInput={textInput} setTextInput={setTextInput} />
        </Tabs.Content>
      </Tabs.Root>

      {uploadedFile && uploadMode === 'file' && (
        <FilePreview
          title={uploadedFile.name}
          subtitle={`Tamanho: ${uploadedFile.size}`}
          status={isSubmitting ? 'progress' : 'idle'}
          progress={uploadedFile.progress}
          onRemove={() => setUploadedFile(null)}
        />
      )}

      <SubmitButton canSubmit={canSubmit} isProcessing={isSubmitting} />
    </form>
  )
}

export default EmailForm
