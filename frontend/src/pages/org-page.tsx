/**
 * Organisation detail page — profile of a single public-sector organisation.
 */

import React, { useEffect, useState } from 'react';
import { navigate } from '@/lib/router';
import { fetchOrganization, fetchContracts } from '@/lib/data';
import { formatCurrency, formatNumber } from '@/lib/format';
import { Badge, ORG_LEVEL_LABELS, STATUS_LABELS } from '@/components/badge';
import { DataTable } from '@/components/data-table';
import type { ColumnDef } from '@/components/data-table';
import { StatsCounter } from '@/components/stats-counter';
import type { Contract, Organization } from '@/types';
import styles from './org-page.module.css';

export interface OrgPageProps {
  /** Organisation ID from the URL parameter */
  orgId: string;
}

const CONTRACT_COLUMNS: ColumnDef<Contract>[] = [
  {
    key: 'id',
    header: 'ID',
    render: (c) => <span className={styles.mono}>{c.id}</span>,
  },
  {
    key: 'title',
    header: 'Título',
    render: (c) => <span className={styles.contractTitle}>{c.title}</span>,
  },
  {
    key: 'amount',
    header: 'Importe',
    render: (c) => formatCurrency(c.amount, c.currency),
    className: styles['col--right'],
  },
  {
    key: 'status',
    header: 'Estado',
    render: (c) => (
      <Badge variant={c.status}>{STATUS_LABELS[c.status]}</Badge>
    ),
  },
  {
    key: 'riskScore',
    header: 'Riesgo',
    render: (c) => {
      const variant =
        c.riskScore >= 75 ? 'critical' : c.riskScore >= 50 ? 'high' : c.riskScore >= 25 ? 'medium' : 'low';
      return <Badge variant={variant}>{c.riskScore}</Badge>;
    },
    className: styles['col--center'],
  },
];

/**
 * Organisation profile page with stats and associated contracts.
 */
export function OrgPage({ orgId }: OrgPageProps) {
  const [org, setOrg] = useState<Organization | null>(null);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchOrganization(orgId), fetchContracts()])
      .then(([orgData, allContracts]) => {
        setOrg(orgData);
        if (orgData) {
          setContracts(allContracts.filter((c) => c.entity === orgData.name));
        }
      })
      .catch((err: unknown) => {
        setError(
          err instanceof Error ? err.message : 'Error al cargar la organización.',
        );
      })
      .finally(() => setLoading(false));
  }, [orgId]);

  function handleBack(e: React.MouseEvent) {
    e.preventDefault();
    navigate('/explore');
  }

  function handleContractClick(contract: Contract) {
    navigate(`/contract/${contract.id}`);
  }

  if (loading) {
    return (
      <main className={styles.page}>
        <div className="container">
          <p className={styles.loading} role="status" aria-live="polite">
            Cargando organización…
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
            ← Volver
          </a>
        </div>
      </main>
    );
  }

  if (!org) {
    return (
      <main className={styles.page}>
        <div className="container">
          <p className={styles.notFound} role="alert">
            Organización <code>{orgId}</code> no encontrada.
          </p>
          <a href="/explore" onClick={handleBack} className={styles.back}>
            ← Volver
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="Navegación de ruta" className={styles.breadcrumb}>
          <a href="/explore" onClick={handleBack} className={styles.back}>
            ← Explorar
          </a>
          <span aria-hidden="true"> / </span>
          <span>{org.name}</span>
        </nav>

        {/* Header */}
        <header className={styles.header}>
          <Badge variant={org.level}>{ORG_LEVEL_LABELS[org.level]}</Badge>
          <h1 className={styles.title}>{org.name}</h1>
          <p className={styles.type}>{org.type}</p>
        </header>

        {/* Description */}
        {org.description && (
          <p className={styles.description}>{org.description}</p>
        )}

        {/* Stats */}
        <section className={styles.stats} aria-labelledby="org-stats-heading">
          <h2 id="org-stats-heading" className={styles.section__title}>
            Estadísticas
          </h2>
          <div className={styles.stats__grid}>
            <StatsCounter
              label="Total contratos"
              value={formatNumber(org.contractCount)}
              icon="📄"
              accent="primary"
            />
            <StatsCounter
              label="Gasto total"
              value={formatCurrency(org.totalSpend)}
              icon="💶"
              accent="primary"
            />
            <StatsCounter
              label="Riesgo promedio"
              value={`${org.avgRiskScore}/100`}
              icon="📊"
              accent={org.avgRiskScore > 60 ? 'danger' : 'primary'}
            />
            <StatsCounter
              label="Alertas abiertas"
              value={formatNumber(org.openAlerts)}
              icon="⚠️"
              accent={org.openAlerts > 10 ? 'warning' : 'success'}
            />
          </div>
        </section>

        {/* Contracts */}
        <section className={styles.contracts} aria-labelledby="org-contracts-heading">
          <h2 id="org-contracts-heading" className={styles.section__title}>
            Contratos ({contracts.length > 0 ? contracts.length : org.contractCount})
          </h2>
          {contracts.length > 0 ? (
            <DataTable<Contract>
              caption={`Contratos de ${org.name}`}
              columns={CONTRACT_COLUMNS}
              rows={contracts}
              getRowKey={(c) => c.id}
              onRowClick={handleContractClick}
            />
          ) : (
            <p className={styles.empty}>
              Los contratos de esta organización no están disponibles en la muestra local.
              En producción se cargarían desde la API.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
