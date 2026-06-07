/**
 * Contract detail page — full information for a single contract plus its alerts.
 */

import React, { useEffect, useState } from 'react';
import { navigate } from '@/lib/router';
import { fetchContract, fetchAlertsForContract } from '@/lib/data';
import { formatCurrency, formatDate } from '@/lib/format';
import {
  Badge,
  ANOMALY_LABELS,
  STATUS_LABELS,
} from '@/components/badge';
import { AlertCard } from '@/components/alert-card';
import type { Alert, Contract, ProcedureType, AwardCriteria } from '@/types';
import styles from './contract-page.module.css';

export interface ContractPageProps {
  /** Contract ID from the URL parameter */
  contractId: string;
}

/** Labelled detail row. */
function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.detail}>
      <dt className={styles.detail__label}>{label}</dt>
      <dd className={styles.detail__value}>{children}</dd>
    </div>
  );
}

/**
 * Contract detail page showing full contract information and related alerts.
 */
export function ContractPage({ contractId }: ContractPageProps) {
  const [contract, setContract] = useState<Contract | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchContract(contractId),
      fetchAlertsForContract(contractId),
    ])
      .then(([contractData, alertsData]) => {
        setContract(contractData);
        setAlerts(alertsData);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Error al cargar el contrato.');
      })
      .finally(() => setLoading(false));
  }, [contractId]);

  function handleBack(e: React.MouseEvent) {
    e.preventDefault();
    navigate('/explore');
  }

  if (loading) {
    return (
      <main className={styles.page}>
        <div className="container">
          <p className={styles.loading} role="status" aria-live="polite">
            Cargando contrato…
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.page}>
        <div className="container">
          <p className={styles.error} role="alert">{error}</p>
          <a href="/explore" onClick={handleBack} className={styles.back}>
            ← Volver a contratos
          </a>
        </div>
      </main>
    );
  }

  if (!contract) {
    return (
      <main className={styles.page}>
        <div className="container">
          <p className={styles.notFound} role="alert">
            Contrato <code>{contractId}</code> no encontrado.
          </p>
          <a href="/explore" onClick={handleBack} className={styles.back}>
            ← Volver a contratos
          </a>
        </div>
      </main>
    );
  }

  const riskVariant =
    contract.riskScore >= 75
      ? 'critical'
      : contract.riskScore >= 50
        ? 'high'
        : contract.riskScore >= 25
          ? 'medium'
          : 'low';

  const PROCEDURE_LABELS: Record<ProcedureType, string> = {
    open: 'Abierto',
    restricted: 'Restringido',
    negotiated: 'Negociado',
    direct: 'Directo',
  };

  const CRITERIA_LABELS: Record<AwardCriteria, string> = {
    'lowest-price': 'Precio más bajo',
    'best-value': 'Mejor valor',
  };

  return (
    <main className={styles.page}>
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="Navegación de ruta" className={styles.breadcrumb}>
          <a href="/explore" onClick={handleBack} className={styles.back}>
            ← Contratos
          </a>
          <span aria-hidden="true"> / </span>
          <span>{contract.id}</span>
        </nav>

        {/* Header */}
        <header className={styles.header}>
          <div className={styles.header__badges}>
            <Badge variant={contract.status}>{STATUS_LABELS[contract.status]}</Badge>
            <Badge variant={riskVariant}>Riesgo: {contract.riskScore}/100</Badge>
          </div>
          <h1 className={styles.title}>{contract.title}</h1>
          <p className={styles.entity}>{contract.entity}</p>
        </header>

        {/* Summary */}
        {contract.summary && (
          <section className={styles.summary} aria-labelledby="summary-heading">
            <h2 id="summary-heading" className={styles.section__title}>
              Resumen
            </h2>
            <p className={styles.summary__text}>{contract.summary}</p>
          </section>
        )}

        {/* Details grid */}
        <section className={styles.details} aria-labelledby="details-heading">
          <h2 id="details-heading" className={styles.section__title}>
            Detalles del contrato
          </h2>
          <dl className={styles.details__grid}>
            <DetailRow label="ID">{contract.id}</DetailRow>
            <DetailRow label="Importe">
              {formatCurrency(contract.amount, contract.currency)}
            </DetailRow>
            <DetailRow label="Fecha">{formatDate(contract.date)}</DetailRow>
            <DetailRow label="Código CPV">{contract.cpvCode}</DetailRow>
            <DetailRow label="Procedimiento">
              {PROCEDURE_LABELS[contract.procedure] ?? contract.procedure}
            </DetailRow>
            <DetailRow label="Criterio adjudicación">
              {CRITERIA_LABELS[contract.awardCriteria] ?? contract.awardCriteria}
            </DetailRow>
            <DetailRow label="Anomalías detectadas">
              {contract.anomalies.length === 0 ? (
                <span className="text-muted">Ninguna</span>
              ) : (
                <div className={styles.anomalies}>
                  {contract.anomalies.map((a) => (
                    <Badge key={a} variant={a}>
                      {ANOMALY_LABELS[a]}
                    </Badge>
                  ))}
                </div>
              )}
            </DetailRow>
          </dl>
        </section>

        {/* Related alerts */}
        {alerts.length > 0 && (
          <section className={styles.alerts} aria-labelledby="alerts-heading">
            <h2 id="alerts-heading" className={styles.section__title}>
              Alertas asociadas ({alerts.length})
            </h2>
            <div className={styles.alerts__grid}>
              {alerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </section>
        )}

        {/* Disclaimer */}
        <aside className={styles.disclaimer} role="note">
          <p>
            <strong>⚠️ Aviso legal:</strong> Las anomalías detectadas son indicadores
            estadísticos. No constituyen acusaciones ni asesoramiento jurídico.
          </p>
        </aside>
      </div>
    </main>
  );
}
