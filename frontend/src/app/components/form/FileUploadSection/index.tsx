import React, { useRef } from 'react';
import { UploadedFile } from '../../../types';
import styles from './FileUploadSection.module.css';
import UploadButtonInitialState from './UploadButtonInitialState';
import UploadButtonUploadingState from './UploadButtonUploadingState';
import UploadButtonUploadedState from './UploadButtonUploadedState';
import FilePreview from './FilePreview';

interface FileUploadSectionProps {
  uploadedFile: UploadedFile | null;
  setUploadedFile: (file: UploadedFile | null) => void;
  isUploading: boolean;
  setIsUploading: (isUploading: boolean) => void;
}

function FileUploadSection({ uploadedFile, setUploadedFile, isUploading, setIsUploading }: FileUploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    const newFile: UploadedFile = {
      file,
      progress: 0,
      name: file.name,
      size: `${sizeInMB} MB`
    };

    setUploadedFile(newFile);
    setIsUploading(true);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadedFile((prev: any) => {
        if (!prev) return null;
        const newProgress = Math.min(prev.progress + 10, 100);
        if (newProgress === 100) {
          setIsUploading(false);
          clearInterval(interval);
        }
        return { ...prev, progress: newProgress } as UploadedFile;
      });
    }, 200);
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.fileUploadSectionContainer}>
      <div>
        <div className={`${styles.fileInputContainer} ${uploadedFile ? styles.fileInputContainerUploaded : ''}`}>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept=".txt,.eml,.pdf,.doc,.docx"
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

        {uploadedFile && (
          <FilePreview
            uploadedFile={uploadedFile}
            isUploading={isUploading}
            removeFile={removeFile}
          />
        )}
      </div>
    </div>
  );
}

export default FileUploadSection;