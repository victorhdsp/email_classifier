import { Loader2 } from 'lucide-react'
import styles from './FileUploadSection.module.scss'

interface UploadButtonUploadingStateProps {
  onClick: () => void
}

function UploadButtonUploadingState({ onClick }: UploadButtonUploadingStateProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={true}
      data-state="uploading"
      className={styles.fileUploadButton}
    >
      <div className={styles.uploadingState}>
        <Loader2 className={styles.uploadingSpinner} />
        <p className={styles.uploadingText}>Processando arquivo...</p>
      </div>
    </button>
  )
}

export default UploadButtonUploadingState
