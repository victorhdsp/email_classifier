import React from 'react';
import { FileText, X } from 'lucide-react';
import { UploadedFile } from '../../../types';
import styles from './FileUploadSection.module.css';

interface FilePreviewProps {
  uploadedFile: UploadedFile;
  isUploading: boolean;
  removeFile: () => void;
}

function FilePreview({ uploadedFile, isUploading, removeFile }: FilePreviewProps) {
  return (
    <div className={styles.filePreviewContainer}>
      <div className={styles.filePreviewHeader}>
        <div className={styles.filePreviewInfo}>
          <div className={styles.filePreviewIconContainer}>
            <FileText className={styles.filePreviewIcon} />
          </div>
          <div>
            <p className={styles.filePreviewName}>{uploadedFile.name}</p>
            <p className={styles.filePreviewSize}>{uploadedFile.size}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={removeFile}
          className={styles.removeFileButton}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {isUploading && (
        <div className={styles.progressBarContainer}>
          <div className={styles.progressBarText}>
            <span>Progresso</span>
            <span>{uploadedFile.progress}%</span>
          </div>
          <div className={styles.progressBarBackground}>
            <div 
              className={styles.progressBarFill}
              style={{ width: `${uploadedFile.progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default FilePreview;
