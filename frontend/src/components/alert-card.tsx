/**
 * AlertCard component.
 *
 * Displays a single anomaly alert with severity indicator, description,
 * legal reference, and a link to the originating contract.
 */

import React from 'react';
import { navigate } from '@/lib/router';
import type { Alert } from '@/types';
import {
  ANOMALY_LABELS,
  Badge,
  SEVERITY_LABELS,
  ALERT_STATUS_LABELS,
} from './badge';
import styles from './alert-card.module.css';
import { formatDate } from '@/lib/format';

export interface AlertCardProps {
  alert: Alert;
}

/**
 * Card displaying a single anomaly alert.
 *
 * @example
 * <AlertCard alert={alertData} />
 */
export function AlertCard({ alert }: AlertCardProps) {
  function handleContractClick(e: React.MouseEvent) {
    e.preventDefault();
    navigate(`/contract/${alert.contractId}`);
  }

  return (
    <article className={`${styles.card} ${styles[`card--${alert.severity}`]}`}>
      <header className={styles.card__header}>
        <div className={styles.card__badges}>
          <Badge variant={alert.severity}>
            {SEVERITY_LABELS[alert.severity]}
          </Badge>
          <Badge variant={alert.type}>
            {ANOMALY_LABELS[alert.type]}
          </Badge>
          <Badge variant="default">
            {ALERT_STATUS_LABELS[alert.status]}
          </Badge>
        </div>
        <time className={styles.card__date} dateTime={alert.date}>
          {formatDate(alert.date)}
        </time>
      </header>

      <div className={styles.card__body}>
        <p className={styles.card__description}>{alert.description}</p>

        <div className={styles.card__legal}>
          <span className={styles.card__legal__label} aria-label="Referencia legal">
            ⚖️
          </span>
          <cite className={styles.card__legal__text}>{alert.legalReference}</cite>
        </div>
      </div>

      <footer className={styles.card__footer}>
        <a
          href={`/contract/${alert.contractId}`}
          className={styles.card__link}
          onClick={handleContractClick}
        >
          {alert.contractTitle}
          <span aria-hidden="true"> →</span>
        </a>
      </footer>
    </article>
  );
}
