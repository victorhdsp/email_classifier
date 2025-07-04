import styles from './SidebarAttributes.module.scss';

interface SidebarHeaderProps {
  resultsCount: number;
}

function SidebarHeader({ resultsCount }: SidebarHeaderProps) {
  return (
    <div className={styles.sidebarHeader}>
      <h3 className={styles.sidebarTitle}>
        Histórico de classificações
      </h3>
      <p className={styles.sidebarSubtitle}>
        {resultsCount} classificaç{resultsCount === 1 ? 'ão' : 'ões'}
      </p>
    </div>
  );
}

export default SidebarHeader;
