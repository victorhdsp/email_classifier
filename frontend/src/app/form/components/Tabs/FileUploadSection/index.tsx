import React, { useEffect, useRef } from 'react'
import { UploadedFile } from '../../../../shared/components/views/AppContent/types'
import styles from './FileUploadSection.module.scss'
import UploadButtonInitialState from './UploadButtonInitialState'
import UploadButtonUploadingState from './UploadButtonUploadingState'
import UploadButtonUploadedState from './UploadButtonUploadedState'

interface FileUploadSectionProps {
  uploadedFile: UploadedFile | null
  setUploadedFile: (file: UploadedFile | null) => void
  isUploading: boolean
}

function FileUploadSection({ uploadedFile, setUploadedFile, isUploading }: FileUploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (uploadedFile == null && fileInputRef.current) fileInputRef.current.value = ''
  }, [uploadedFile])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2)
    const newFile: UploadedFile = {
      file,
      progress: 0,
      name: file.name,
      size: `${sizeInMB} MB`,
    }

    setUploadedFile(newFile)
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={styles.fileUploadSectionContainer}>
      <div>
        <div
          data-uploaded={!!uploadedFile}
          className={styles.fileInputContainer}
          data-tour="file-input"
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept=".txt,.pdf"
            className="hidden"
            disabled={isUploading}
          />
          {isUploading ? (
            <UploadButtonUploadingState onClick={handleButtonClick} />
          ) : uploadedFile ? (
            <UploadButtonUploadedState onClick={handleButtonClick} />
          ) : (
            <UploadButtonInitialState onClick={handleButtonClick} />
          )}
        </div>
      </div>
    </div>
  )
}

export default FileUploadSection
