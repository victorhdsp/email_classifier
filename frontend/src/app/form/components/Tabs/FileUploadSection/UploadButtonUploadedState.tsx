import { FileText } from 'lucide-react'
import styles from './FileUploadSection.module.scss'

interface UploadButtonUploadedStateProps {
  onClick: () => void
}

function UploadButtonUploadedState({ onClick }: UploadButtonUploadedStateProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-state="uploaded"
      className={styles.fileUploadButton}
    >
      <div className={styles.uploadedState}>
        <div className={styles.uploadedIconContainer}>
          <FileText className={styles.uploadedIcon} />
        </div>
        <p className={styles.uploadedText}>Arquivo carregado!</p>
        <p className={styles.uploadedSubText}>Clique para selecionar outro</p>
      </div>
    </button>
  )
}

export default UploadButtonUploadedState
