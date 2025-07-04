import styles from './ButtonToggle.module.scss';
import { Tabs } from "radix-ui";
import React from 'react';

interface ButtonToggleProps {
  value: 'file' | 'text';
  text: string;
  Icon: React.ElementType;
}

export function ButtonToggle({value, text, Icon}: ButtonToggleProps) {
  return (
    <Tabs.Trigger
      value={value}
      className={`${styles.tabTrigger}`}
    >
      <Icon className="w-4 h-4" />
      <span>{text}</span>
    </Tabs.Trigger>
  );
}