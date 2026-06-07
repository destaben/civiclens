import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTable } from '@/components/data-table';

interface Row {
  id: string;
  name: string;
  value: number;
}

const COLUMNS = [
  { key: 'id', header: 'ID' },
  { key: 'name', header: 'Nombre' },
  { key: 'value', header: 'Valor' },
];

const ROWS: Row[] = [
  { id: 'r1', name: 'Alpha', value: 100 },
  { id: 'r2', name: 'Beta', value: 200 },
];

describe('DataTable', () => {
  it('renders column headers', () => {
    render(
      <DataTable<Row>
        caption="Test table"
        columns={COLUMNS}
        rows={ROWS}
        getRowKey={(r) => r.id}
      />,
    );
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Nombre')).toBeInTheDocument();
    expect(screen.getByText('Valor')).toBeInTheDocument();
  });

  it('renders row data', () => {
    render(
      <DataTable<Row>
        caption="Test table"
        columns={COLUMNS}
        rows={ROWS}
        getRowKey={(r) => r.id}
      />,
    );
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  it('renders empty message when rows is empty', () => {
    render(
      <DataTable<Row>
        caption="Test table"
        columns={COLUMNS}
        rows={[]}
        getRowKey={(r) => r.id}
        emptyMessage="Sin datos"
      />,
    );
    expect(screen.getByText('Sin datos')).toBeInTheDocument();
  });

  it('calls onRowClick when a row is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <DataTable<Row>
        caption="Test table"
        columns={COLUMNS}
        rows={ROWS}
        getRowKey={(r) => r.id}
        onRowClick={handleClick}
      />,
    );
    await user.click(screen.getByText('Alpha'));
    expect(handleClick).toHaveBeenCalledWith(ROWS[0]);
  });

  it('includes a visually hidden caption for accessibility', () => {
    render(
      <DataTable<Row>
        caption="Accessible caption"
        columns={COLUMNS}
        rows={ROWS}
        getRowKey={(r) => r.id}
      />,
    );
    expect(screen.getByText('Accessible caption')).toBeInTheDocument();
  });
});
