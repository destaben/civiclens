/**
 * StatsCounter component.
 *
 * Displays a single platform metric with an optional icon and trend indicator.
 */

import React from 'react';
import styles from './stats-counter.module.css';

export interface StatsCounterProps {
  /** Metric label */
  label: string;
  /** Formatted string value to display prominently */
  value: string;
  /** Optional icon element rendered above the value */
  icon?: React.ReactNode;
  /** Optional contextual description below the label */
  description?: string;
  /** Optional colour accent: 'primary' | 'warning' | 'danger' | 'success' */
  accent?: 'primary' | 'warning' | 'danger' | 'success';
}

/**
 * A card that displays a single stat metric prominently.
 *
 * @example
 * <StatsCounter label="Contratos activos" value="3.389" accent="primary" />
 */
export function StatsCounter({
  label,
  value,
  icon,
  description,
  accent = 'primary',
}: StatsCounterProps) {
  return (
    <div className={`${styles.counter} ${styles[`counter--${accent}`]}`}>
      {icon && (
        <div className={styles.counter__icon} aria-hidden="true">
          {icon}
        </div>
      )}
      <p className={styles.counter__value}>{value}</p>
      <p className={styles.counter__label}>{label}</p>
      {description && (
        <p className={styles.counter__description}>{description}</p>
      )}
    </div>
  );
}
