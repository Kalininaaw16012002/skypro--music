'use client';

import styles from './filteritem.module.css';
import classNames from 'classnames';

interface FilterItemProps {
  text: string;
  isActive?: boolean;
  onClick?: () => void;
}

export default function FilterItem({ text, isActive = false, onClick }: FilterItemProps) {
  return (
    <div
      className={classNames(styles.filter__item, { [styles.active]: isActive })}
      onClick={onClick}
    >
      {text}
    </div>
  );
}