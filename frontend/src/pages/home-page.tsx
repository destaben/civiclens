/**
 * Home page — visual dashboard with key metrics and detected findings.
 */

import React, { useEffect, useState } from 'react';
import { navigate } from '@/lib/router';
import { fetchContracts, fetchOrganizations, fetchStats } from '@/lib/data';
import { formatCurrency, formatNumber } from '@/lib/format';
import { ANOMALY_LABELS } from '@/components/badge';
import { StatsCounter } from '@/components/stats-counter';
import type { Contract, Organization, Stats } from '@/types';
import styles from './home-page.module.css';

/**
 * Landing page that showcases platform statistics and the most recent alerts.
 */
export function HomePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchStats(), fetchContracts(), fetchOrganizations()])
      .then(([statsData, contractsData, organizationsData]) => {
        setStats(statsData);
        setContracts(contractsData);
        setOrganizations(organizationsData);
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

  const topRiskContracts = [...contracts]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 4);

  const topSpendingOrgs = [...organizations]
    .sort((a, b) => b.totalSpend - a.totalSpend)
    .slice(0, 4);

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="hero-heading">
        <div className="container">
          <div className={styles.hero__panel}>
            <p className="eyebrow">CivicLens Dashboard</p>
            <h1 id="hero-heading" className={styles.hero__title}>
              Busca contratos, detecta riesgos y entiende el contexto publico en segundos.
            </h1>
            <p className={styles.hero__subtitle}>
              Una interfaz simple para navegar datos reales de contratacion con foco en
              hallazgos de alto impacto economico y patrones de riesgo.
            </p>
            <div className={styles.hero__actions}>
              <a
                href="/explore"
                className={styles.btn}
                onClick={handleExploreClick}
              >
                Explorar contratos
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.stats} aria-labelledby="stats-heading">
        <div className="container">
          <h2 id="stats-heading" className="section-title">
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
                accent="warning"
              />
              <StatsCounter
                label="Riesgo promedio"
                value={`${stats.avgRiskScore}/100`}
                icon="📊"
                accent={stats.avgRiskScore > 60 ? 'danger' : 'primary'}
              />
              <StatsCounter
                label="Contratos activos"
                value={formatNumber(stats.contractsByStatus.active)}
                icon="🧭"
                accent="success"
              />
            </div>
          )}
        </div>
      </section>

      <section className={styles.findings} aria-labelledby="findings-heading">
        <div className="container">
          <div className={styles.findings__header}>
            <h2 id="findings-heading" className="section-title">
              Hallazgos destacados
            </h2>
            <p className="text-muted">Contratos con mayor score de riesgo y tipologias mas frecuentes.</p>
          </div>

          <div className={styles.findings__grid}>
            <article className={`${styles.panel} panel`}>
              <h3 className={styles.panel__title}>Top riesgo</h3>
              {topRiskContracts.length === 0 ? (
                <p className="text-muted">Sin datos de riesgo por ahora.</p>
              ) : (
                <ul className={styles.list}>
                  {topRiskContracts.map((contract) => (
                    <li key={contract.id}>
                      <button
                        type="button"
                        className={styles.list__item}
                        onClick={() => navigate(`/contract/${contract.id}`)}
                      >
                        <span>
                          <strong>{contract.title}</strong>
                          <small>{contract.entity}</small>
                        </span>
                        <span
                          className={`${styles.riskScore} ${
                            contract.riskScore >= 75 ? styles['riskScore--critical'] : styles['riskScore--high']
                          }`}
                        >
                          {contract.riskScore}/100
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </article>

            <article className={`${styles.panel} panel`}>
              <h3 className={styles.panel__title}>Tipos de anomalia frecuentes</h3>
              <ol className={styles.anomalyList}>
                {stats?.topAnomalyTypes.map((item) => (
                  <li key={item.type} className={styles.anomalyRow}>
                    <span>{ANOMALY_LABELS[item.type]}</span>
                    <strong>{item.count}</strong>
                  </li>
                ))}
              </ol>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.organizations} aria-labelledby="org-heading">
        <div className="container">
          <h2 id="org-heading" className="section-title">Organismos con mayor volumen de gasto</h2>
          <div className={styles.orgs__grid}>
            {topSpendingOrgs.map((org) => (
              <button
                key={org.id}
                type="button"
                className={styles.orgCard}
                onClick={() => navigate(`/org/${org.id}`)}
              >
                <p className={styles.orgCard__name}>{org.name}</p>
                <p className={styles.orgCard__meta}>Gasto total</p>
                <p className={styles.orgCard__value}>{formatCurrency(org.totalSpend)}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

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
