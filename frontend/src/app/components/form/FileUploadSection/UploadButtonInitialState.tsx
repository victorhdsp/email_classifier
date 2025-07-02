import React from 'react';
import { Upload } from 'lucide-react';
import styles from './FileUploadSection.module.css';

interface UploadButtonInitialStateProps {
  onClick: () => void;
}

function UploadButtonInitialState({ onClick }: UploadButtonInitialStateProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${styles.fileUploadButton} border-gray-300`}
    >
      <div className={styles.initialState}>
        <div className={styles.initialIconContainer}>
          <Upload className={styles.initialIcon} />
        </div>
        <p className={styles.initialText}>Selecionar arquivo</p>
        <p className={styles.initialSubText}>TXT, EML, PDF, DOC, DOCX</p>
      </div>
    </button>
  );
}

export default UploadButtonInitialState;
