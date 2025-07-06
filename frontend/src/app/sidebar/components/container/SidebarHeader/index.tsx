import styles from './Header.module.scss'

interface SidebarHeaderProps {
  resultsCount: number
}

export function SidebarHeader({ resultsCount }: SidebarHeaderProps) {
  return (
    <div className={styles.sidebarHeader}>
      <h3 className={styles.sidebarTitle}>Histórico de classificações</h3>
      <p className={styles.sidebarSubtitle}>
        {resultsCount} classificaç{resultsCount === 1 ? 'ão' : 'ões'}
      </p>
    </div>
  )
}
