/**
 * Badge component.
 *
 * Renders a small pill with colour-coded styling that reflects severity,
 * contract status, or organisation level.
 */

import React from 'react';
import type { AlertStatus, AnomalyType, ContractStatus, OrgLevel, Severity } from '@/types';
import styles from './badge.module.css';

/** Supported badge variants */
export type BadgeVariant =
  | Severity
  | ContractStatus
  | OrgLevel
  | AnomalyType
  | 'default'
  | 'info';

export interface BadgeProps {
  /** Visual style variant */
  variant?: BadgeVariant;
  /** Badge content */
  children: React.ReactNode;
  /** Additional CSS class names */
  className?: string;
}

/** Human-readable labels for anomaly types */
export const ANOMALY_LABELS: Record<AnomalyType, string> = {
  'split-contract': 'Contrato fraccionado',
  'short-tender-window': 'Plazo reducido',
  'anomalous-pricing': 'Precio anómalo',
  'sole-source': 'Adjudicación directa',
};

/** Human-readable labels for severity levels */
export const SEVERITY_LABELS: Record<Severity, string> = {
  critical: 'Crítico',
  high: 'Alto',
  medium: 'Medio',
  low: 'Bajo',
};

/** Human-readable labels for contract statuses */
export const STATUS_LABELS: Record<ContractStatus, string> = {
  active: 'Activo',
  awarded: 'Adjudicado',
  cancelled: 'Cancelado',
};

/** Human-readable labels for alert statuses */
export const ALERT_STATUS_LABELS: Record<AlertStatus, string> = {
  open: 'Abierta',
  reviewing: 'En revisión',
  resolved: 'Resuelta',
};

/** Human-readable labels for organisation levels */
export const ORG_LEVEL_LABELS: Record<OrgLevel, string> = {
  national: 'Nacional',
  regional: 'Regional',
  local: 'Local',
};

/**
 * Colour-coded pill badge.
 *
 * @example
 * <Badge variant="critical">Crítico</Badge>
 */
export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`${styles.badge} ${styles[`badge--${variant}`] ?? ''} ${className}`.trim()}
      aria-label={typeof children === 'string' ? children : undefined}
    >
      {children}
    </span>
  );
}
