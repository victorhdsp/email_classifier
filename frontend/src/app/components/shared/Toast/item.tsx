import { X, CheckCircle2, XCircle } from 'lucide-react';
import * as RadixToast from '@radix-ui/react-toast';
import styles from './item.module.scss';
import { ToastMessage } from './provider';

interface ToastItemProps {
  data: ToastMessage;
  onClose: () => void;
}

export function ToastItem({ data, onClose }: ToastItemProps) {
  const { title, description, variant = 'error', duration = 3000 } = data;
  const Icon = variant === 'success' ? CheckCircle2 : XCircle;
  const iconStyle = variant === 'success' ? styles.successIcon : styles.errorIcon;

  return (
    <RadixToast.Root className={styles.toastRoot} onOpenChange={onClose} duration={duration}>
      <div className={styles.iconContainer}>
        <Icon className={iconStyle} size={24} />
      </div>
      <div className={styles.contentContainer}>
        <RadixToast.Title className={styles.title}>{title}</RadixToast.Title>
        {description && (
          <RadixToast.Description className={styles.description}>
            {description}
          </RadixToast.Description>
        )}
      </div>
      <RadixToast.Close asChild>
        <button className={styles.closeButton}>
          <X className="h-4 w-4" />
        </button>
      </RadixToast.Close>
    </RadixToast.Root>
  );
}