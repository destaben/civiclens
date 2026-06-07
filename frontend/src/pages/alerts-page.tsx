/**
 * Alerts page — filterable list of all anomaly alerts.
 */

import { useEffect, useMemo, useState } from 'react';
import { fetchAlerts } from '@/lib/data';
import { AlertCard } from '@/components/alert-card';
import { Badge, SEVERITY_LABELS } from '@/components/badge';
import type { Alert, AlertStatus, Severity } from '@/types';
import styles from './alerts-page.module.css';

/**
 * Page listing all anomaly alerts with severity and status filters.
 */
export function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [severityFilter, setSeverityFilter] = useState<Severity | ''>('');
  const [statusFilter, setStatusFilter] = useState<AlertStatus | ''>('');

  useEffect(() => {
    fetchAlerts()
      .then(setAlerts)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Error al cargar alertas.');
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () =>
      alerts.filter((a) => {
        if (severityFilter && a.severity !== severityFilter) return false;
        if (statusFilter && a.status !== statusFilter) return false;
        return true;
      }),
    [alerts, severityFilter, statusFilter],
  );

  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;
  const openCount = alerts.filter((a) => a.status === 'open').length;

  return (
    <main className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Alertas de anomalías</h1>
            <p className="text-muted">
              {loading
                ? 'Cargando…'
                : `${filtered.length} alerta${filtered.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          {!loading && (
            <div className={styles.summary}>
              <Badge variant="critical">{criticalCount} críticas</Badge>
              <Badge variant="info">{openCount} abiertas</Badge>
            </div>
          )}
        </header>

        {/* Filters */}
        <section className={styles.filters} aria-label="Filtros de alertas">
          <div className={styles.filters__group}>
            <label htmlFor="severity" className={styles.label}>
              Severidad
            </label>
            <select
              id="severity"
              className={styles.select}
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as Severity | '')}
              aria-label="Filtrar por severidad"
            >
              <option value="">Todas</option>
              <option value="critical">Crítico</option>
              <option value="high">Alto</option>
              <option value="medium">Medio</option>
              <option value="low">Bajo</option>
            </select>
          </div>

          <div className={styles.filters__group}>
            <label htmlFor="alertStatus" className={styles.label}>
              Estado
            </label>
            <select
              id="alertStatus"
              className={styles.select}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AlertStatus | '')}
              aria-label="Filtrar por estado de alerta"
            >
              <option value="">Todos</option>
              <option value="open">Abierta</option>
              <option value="reviewing">En revisión</option>
              <option value="resolved">Resuelta</option>
            </select>
          </div>
        </section>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        {loading ? (
          <p className={styles.loading} role="status" aria-live="polite">
            Cargando alertas…
          </p>
        ) : filtered.length === 0 ? (
          <p className={styles.empty}>
            No hay alertas con los filtros seleccionados.
          </p>
        ) : (
          <>
            {/* Group by severity */}
            {(['critical', 'high', 'medium', 'low'] as Severity[]).map((severity) => {
              const group = filtered.filter((a) => a.severity === severity);
              if (group.length === 0) return null;
              return (
                <section
                  key={severity}
                  className={styles.group}
                  aria-labelledby={`group-${severity}`}
                >
                  <h2 id={`group-${severity}`} className={styles.group__heading}>
                    <Badge variant={severity}>{SEVERITY_LABELS[severity]}</Badge>
                    <span className={styles.group__count}>{group.length}</span>
                  </h2>
                  <div className={styles.grid}>
                    {group.map((alert) => (
                      <AlertCard key={alert.id} alert={alert} />
                    ))}
                  </div>
                </section>
              );
            })}
          </>
        )}
      </div>
    </main>
  );
}