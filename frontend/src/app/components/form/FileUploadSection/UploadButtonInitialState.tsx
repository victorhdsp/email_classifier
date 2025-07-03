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
      className={`${styles.fileUploadButton} h-[274px] border-gray-300`}
    >
      <div className={styles.initialState}>
        <div className={styles.initialIconContainer}>
          <Upload className={styles.initialIcon} />
        </div>
        <p className={styles.initialText}>Selecionar arquivo</p>
        <p className={styles.initialSubText}>TXT, PDF</p>
      </div>
    </button>
  );
}

export default UploadButtonInitialState;
