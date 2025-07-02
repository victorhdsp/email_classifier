import React from 'react';
import { Loader2, Mail } from 'lucide-react';
import styles from './SubmitButton.module.css';

interface SubmitButtonProps {
  canSubmit: boolean;
  isProcessing: boolean;
}

function SubmitButton({ canSubmit, isProcessing }: SubmitButtonProps) {
  return (
    <div className={styles.submitButtonContainer}>
      <button
        type="submit"
        disabled={!canSubmit || isProcessing}
        className={styles.submitButton}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Classificando...</span>
          </>
        ) : (
          <>
            <Mail className="w-5 h-5" />
            <span>Classificar Email</span>
          </>
        )}
      </button>
    </div>
  );
}

export default SubmitButton;
