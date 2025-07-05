import { Upload } from 'lucide-react'
import styles from './FileUploadSection.module.scss'

interface UploadButtonInitialStateProps {
  onClick: () => void
}

function UploadButtonInitialState({ onClick }: UploadButtonInitialStateProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-state="initial"
      className={styles.fileUploadButton}
    >
      <div className={styles.initialState}>
        <div className={styles.initialIconContainer}>
          <Upload className={styles.initialIcon} />
        </div>
        <p className={styles.initialText}>Selecionar arquivo</p>
        <p className={styles.initialSubText}>TXT, PDF</p>
      </div>
    </button>
  )
}

export default UploadButtonInitialState
