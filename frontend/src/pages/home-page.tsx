/**
 * Home page — platform overview with key statistics and recent alerts.
 */

import React, { useEffect, useState } from 'react';
import { navigate } from '@/lib/router';
import { fetchStats, fetchAlerts } from '@/lib/data';
import { formatCurrency, formatNumber } from '@/lib/format';
import { StatsCounter } from '@/components/stats-counter';
import { AlertCard } from '@/components/alert-card';
import type { Alert, Stats } from '@/types';
import styles from './home-page.module.css';

/**
 * Landing page that showcases platform statistics and the most recent alerts.
 */
export function HomePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchStats(), fetchAlerts()])
      .then(([statsData, alertsData]) => {
        setStats(statsData);
        setAlerts(alertsData.slice(0, 3));
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Error al cargar los datos.');
      })
      .finally(() => setLoading(false));
  }, []);

  function handleExploreClick(e: React.MouseEvent) {
    e.preventDefault();
    navigate('/explore');
  }

  function handleAlertsClick(e: React.MouseEvent) {
    e.preventDefault();
    navigate('/alerts');
  }

  return (
    <main className={styles.page}>
      {/* Hero */}
      <section className={styles.hero} aria-labelledby="hero-heading">
        <div className="container">
          <h1 id="hero-heading" className={styles.hero__title}>
            Transparencia en la{' '}
            <span className={styles.hero__title__highlight}>contratación pública</span>
            {', '}impulsada por IA
          </h1>
          <p className={styles.hero__subtitle}>
            CivicLens analiza contratos gubernamentales para detectar anomalías y
            patrones irregulares usando inteligencia artificial. Los resultados son
            indicadores estadísticos, no acusaciones legales.
          </p>
          <div className={styles.hero__actions}>
            <a
              href="/explore"
              className={styles.btn}
              onClick={handleExploreClick}
            >
              Explorar contratos
            </a>
            <a
              href="/alerts"
              className={`${styles.btn} ${styles['btn--secondary']}`}
              onClick={handleAlertsClick}
            >
              Ver alertas
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.stats} aria-labelledby="stats-heading">
        <div className="container">
          <h2 id="stats-heading" className={styles.section__title}>
            Estadísticas de la plataforma
          </h2>

          {loading && (
            <p className={styles.loading} role="status" aria-live="polite">
              Cargando estadísticas…
            </p>
          )}

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          {stats && !loading && (
            <div className={styles.stats__grid}>
              <StatsCounter
                label="Total contratos"
                value={formatNumber(stats.totalContracts)}
                icon="📄"
                accent="primary"
              />
              <StatsCounter
                label="Gasto total"
                value={formatCurrency(stats.totalSpend)}
                icon="💶"
                accent="primary"
              />
              <StatsCounter
                label="Alertas abiertas"
                value={formatNumber(stats.openAlerts)}
                icon="⚠️"
                accent="warning"
                description={`${stats.alertsBySeverity.critical} críticas`}
              />
              <StatsCounter
                label="Riesgo promedio"
                value={`${stats.avgRiskScore}/100`}
                icon="📊"
                accent={stats.avgRiskScore > 60 ? 'danger' : 'primary'}
              />
            </div>
          )}
        </div>
      </section>

      {/* Recent alerts */}
      <section className={styles.recent} aria-labelledby="recent-heading">
        <div className="container">
          <div className={styles.section__header}>
            <h2 id="recent-heading" className={styles.section__title}>
              Alertas recientes
            </h2>
            <a
              href="/alerts"
              className={styles.section__link}
              onClick={handleAlertsClick}
            >
              Ver todas →
            </a>
          </div>

          {!loading && alerts.length === 0 && (
            <p className="text-muted">No hay alertas recientes.</p>
          )}

          <div className={styles.alerts__grid}>
            {alerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <aside className={styles.disclaimer} role="note">
        <div className="container">
          <p>
            <strong>⚠️ Aviso legal:</strong> CivicLens es una herramienta informativa.
            Las anomalías detectadas son indicadores estadísticos basados en patrones.
            No constituyen acusaciones de irregularidad o ilegalidad, ni asesoramiento
            jurídico. Consulte con profesionales cualificados antes de actuar.
          </p>
        </div>
      </aside>
    </main>
  );
}
