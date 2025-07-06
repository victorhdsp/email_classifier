import { FileText, Loader2, X } from 'lucide-react'
import styles from './FilePreview.module.scss'

interface FilePreviewProps {
  title: string
  subtitle?: string
  status: 'progress' | 'loading' | 'idle'
  progress?: number
  onRemove?: () => void
}

export function FilePreview({ title, subtitle, status, progress = 0, onRemove }: FilePreviewProps) {
  const renderIcon = () => {
    if (status === 'loading') {
      return <Loader2 className={styles.loadingIcon} />
    }
    return <FileText className={styles.fileIcon} />
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.info}>
          <div className={styles.iconContainer}>{renderIcon()}</div>
          <div>
            <p className={styles.title}>{title}</p>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </div>
        {onRemove && (
          <button type="button" onClick={onRemove} className={styles.removeButton}>
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {status === 'progress' && (
        <div className={styles.progressBarContainer}>
          <div className={styles.progressBarText}>
            <span>Progresso</span>
            <span>{progress}%</span>
          </div>
          <div className={styles.progressBarBackground}>
            <div className={styles.progressBarFill} style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
    </div>
  )
}
