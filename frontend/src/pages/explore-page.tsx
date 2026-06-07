/**
 * Explore page — searchable, filterable list of all contracts.
 */

import { useEffect, useMemo, useState } from 'react';
import { navigate } from '@/lib/router';
import { fetchContracts } from '@/lib/data';
import { formatCurrency, formatDate } from '@/lib/format';
import { Badge, ANOMALY_LABELS, STATUS_LABELS } from '@/components/badge';
import { DataTable } from '@/components/data-table';
import type { ColumnDef } from '@/components/data-table';
import type { AnomalyType, Contract, ContractStatus } from '@/types';
import styles from './explore-page.module.css';

/** Risk score display with colour coding. */
function RiskBadge({ score }: { score: number }) {
  const variant =
    score >= 75 ? 'critical' : score >= 50 ? 'high' : score >= 25 ? 'medium' : 'low';
  return <Badge variant={variant}>{score}</Badge>;
}

const COLUMNS: ColumnDef<Contract>[] = [
  {
    key: 'id',
    header: 'ID',
    render: (c) => <span className={styles.id}>{c.id}</span>,
  },
  {
    key: 'title',
    header: 'Título',
    render: (c) => <span className={styles.contractTitle}>{c.title}</span>,
  },
  {
    key: 'entity',
    header: 'Entidad',
  },
  {
    key: 'amount',
    header: 'Importe',
    render: (c) => formatCurrency(c.amount, c.currency),
    className: styles['col--amount'],
  },
  {
    key: 'date',
    header: 'Fecha',
    render: (c) => formatDate(c.date),
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
    render: (c) => <RiskBadge score={c.riskScore} />,
    className: styles['col--center'],
  },
  {
    key: 'anomalies',
    header: 'Anomalías',
    render: (c) => (
      <div className={styles.anomalies}>
        {c.anomalies.length === 0 ? (
          <span className="text-subtle">—</span>
        ) : (
          c.anomalies.map((a) => (
            <Badge key={a} variant={a}>
              {ANOMALY_LABELS[a]}
            </Badge>
          ))
        )}
      </div>
    ),
  },
];

/**
 * Searchable, filterable contracts table.
 */
export function ExplorePage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContractStatus | ''>('');
  const [minRisk, setMinRisk] = useState<number>(0);

  useEffect(() => {
    fetchContracts()
      .then(setContracts)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Error al cargar contratos.');
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return contracts.filter((c) => {
      if (q && !c.title.toLowerCase().includes(q) && !c.entity.toLowerCase().includes(q)) {
        return false;
      }
      if (statusFilter && c.status !== statusFilter) return false;
      if (c.riskScore < minRisk) return false;
      return true;
    });
  }, [contracts, search, statusFilter, minRisk]);

  function handleRowClick(contract: Contract) {
    navigate(`/contract/${contract.id}`);
  }

  return (
    <main className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Explorar contratos</h1>
            <p className="text-muted">
              {loading
                ? 'Cargando…'
                : `${filtered.length} contrato${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </header>

        {/* Filters */}
        <section className={styles.filters} aria-label="Filtros de contratos">
          <div className={styles.filters__group}>
            <label htmlFor="search" className={styles.label}>
              Buscar
            </label>
            <input
              id="search"
              type="search"
              className={styles.input}
              placeholder="Título o entidad…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Buscar contratos por título o entidad"
            />
          </div>

          <div className={styles.filters__group}>
            <label htmlFor="status" className={styles.label}>
              Estado
            </label>
            <select
              id="status"
              className={styles.select}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ContractStatus | '')}
              aria-label="Filtrar por estado"
            >
              <option value="">Todos</option>
              <option value="active">Activo</option>
              <option value="awarded">Adjudicado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>

          <div className={styles.filters__group}>
            <label htmlFor="minRisk" className={styles.label}>
              Riesgo mínimo: <strong>{minRisk}</strong>
            </label>
            <input
              id="minRisk"
              type="range"
              min={0}
              max={100}
              step={5}
              value={minRisk}
              onChange={(e) => setMinRisk(Number(e.target.value))}
              className={styles.range}
              aria-label={`Riesgo mínimo: ${minRisk}`}
            />
          </div>
        </section>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        {loading ? (
          <p className={styles.loading} role="status" aria-live="polite">
            Cargando contratos…
          </p>
        ) : (
          <DataTable<Contract>
            caption="Listado de contratos públicos"
            columns={COLUMNS}
            rows={filtered}
            getRowKey={(c) => c.id}
            onRowClick={handleRowClick}
            emptyMessage="No se encontraron contratos con los filtros aplicados."
          />
        )}

        {/* Anomaly legend */}
        <aside className={styles.legend} aria-label="Leyenda de tipos de anomalía">
          <p className={styles.legend__title}>Tipos de anomalía</p>
          <ul className={styles.legend__list} role="list">
            {(Object.entries(ANOMALY_LABELS) as [AnomalyType, string][]).map(([key, label]) => (
              <li key={key}>
                <Badge variant={key}>{label}</Badge>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  );
}
