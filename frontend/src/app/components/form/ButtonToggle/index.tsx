import styles from './ButtonToggle.module.scss';
import { Tabs } from "radix-ui";
import React from 'react';

interface ButtonToggleProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: 'file' | 'text';
  text: string;
  Icon: React.ElementType;
}

export function ButtonToggle({value, text, Icon, ...rest}: ButtonToggleProps) {
  return (
    <Tabs.Trigger
      {...rest}
      value={value}
      className={`${styles.tabTrigger}`}
    >
      <Icon className="w-4 h-4" />
      <span>{text}</span>
    </Tabs.Trigger>
  );
}