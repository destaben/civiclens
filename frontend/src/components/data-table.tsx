/**
 * DataTable component.
 *
 * A generic, accessible table that renders an array of typed row objects.
 * Consumers provide column definitions that describe each column's header,
 * key, and optional cell renderer.
 */

import React from 'react';
import styles from './data-table.module.css';

/** Definition of a single table column */
export interface ColumnDef<TRow> {
  /** Unique column identifier */
  key: string;
  /** Column header text */
  header: string;
  /** Custom cell renderer; falls back to `String(row[key])` */
  render?: (row: TRow) => React.ReactNode;
  /** Optional additional CSS class on header and cells */
  className?: string;
}

export interface DataTableProps<TRow extends object> {
  /** Ordered column definitions */
  columns: ColumnDef<TRow>[];
  /** Row data; each item corresponds to a `<tr>` */
  rows: TRow[];
  /** Accessible caption for the table (required for screen readers) */
  caption: string;
  /** Rendered when rows is empty */
  emptyMessage?: string;
  /** Key function to derive a stable key for each row */
  getRowKey: (row: TRow) => string;
  /** Optional callback when a row is clicked */
  onRowClick?: (row: TRow) => void;
}

/**
 * Accessible data table with optional row-click interaction.
 *
 * @example
 * <DataTable
 *   caption="Listado de contratos"
 *   columns={columns}
 *   rows={contracts}
 *   getRowKey={(c) => c.id}
 *   onRowClick={(c) => navigate(`/contract/${c.id}`)}
 * />
 */
export function DataTable<TRow extends object>({
  columns,
  rows,
  caption,
  emptyMessage = 'No hay datos disponibles.',
  getRowKey,
  onRowClick,
}: DataTableProps<TRow>) {
  const isInteractive = Boolean(onRowClick);

  return (
    <div className={styles.wrapper} role="region" aria-label={caption}>
      <table className={styles.table}>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={`${styles.th} ${col.className ?? ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className={styles.empty}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={getRowKey(row)}
                className={`${styles.tr} ${isInteractive ? styles['tr--clickable'] : ''}`}
                onClick={isInteractive ? () => onRowClick?.(row) : undefined}
                tabIndex={isInteractive ? 0 : undefined}
                onKeyDown={
                  isInteractive
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onRowClick?.(row);
                        }
                      }
                    : undefined
                }
                role={isInteractive ? 'button' : undefined}
                aria-label={isInteractive ? `Ver detalles de fila ${getRowKey(row)}` : undefined}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`${styles.td} ${col.className ?? ''}`}>
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
