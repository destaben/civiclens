import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge, ANOMALY_LABELS, SEVERITY_LABELS, STATUS_LABELS } from '@/components/badge';

describe('Badge', () => {
  it('renders children text', () => {
    render(<Badge>Test badge</Badge>);
    expect(screen.getByText('Test badge')).toBeInTheDocument();
  });

  it('applies the correct variant class for "critical"', () => {
    const { container } = render(<Badge variant="critical">Crítico</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toMatch(/badge--critical/);
  });

  it('applies the default variant class when no variant is given', () => {
    const { container } = render(<Badge>Default</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toMatch(/badge--default/);
  });

  it('renders an accessible aria-label for string children', () => {
    render(<Badge variant="high">Alto</Badge>);
    const badge = screen.getByLabelText('Alto');
    expect(badge).toBeInTheDocument();
  });
});

describe('Badge label maps', () => {
  it('ANOMALY_LABELS covers all anomaly types', () => {
    const keys = Object.keys(ANOMALY_LABELS);
    expect(keys).toContain('split-contract');
    expect(keys).toContain('short-tender-window');
    expect(keys).toContain('anomalous-pricing');
    expect(keys).toContain('sole-source');
  });

  it('SEVERITY_LABELS covers all severity levels', () => {
    const keys = Object.keys(SEVERITY_LABELS);
    expect(keys).toContain('critical');
    expect(keys).toContain('high');
    expect(keys).toContain('medium');
    expect(keys).toContain('low');
  });

  it('STATUS_LABELS covers all contract statuses', () => {
    const keys = Object.keys(STATUS_LABELS);
    expect(keys).toContain('active');
    expect(keys).toContain('awarded');
    expect(keys).toContain('cancelled');
  });
});
