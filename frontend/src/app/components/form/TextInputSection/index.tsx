import React from 'react';
import styles from './TextInputSection.module.css';

interface TextInputSectionProps {
  textInput: string;
  setTextInput: (text: string) => void;
}

function TextInputSection({ textInput, setTextInput }: TextInputSectionProps) {
  return (
    <div>
      <textarea
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        placeholder="Cole o conteúdo do email aqui..."
        rows={6}
        className={styles.textArea}
      />
    </div>
  );
}

export default TextInputSection;
