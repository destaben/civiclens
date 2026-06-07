import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatsCounter } from '@/components/stats-counter';

describe('StatsCounter', () => {
  it('renders label and value', () => {
    render(<StatsCounter label="Total contratos" value="3.389" />);
    expect(screen.getByText('Total contratos')).toBeInTheDocument();
    expect(screen.getByText('3.389')).toBeInTheDocument();
  });

  it('renders optional description when provided', () => {
    render(
      <StatsCounter
        label="Alertas"
        value="82"
        description="12 críticas"
      />,
    );
    expect(screen.getByText('12 críticas')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(<StatsCounter label="Contratos" value="100" icon="📄" />);
    expect(screen.getByText('📄')).toBeInTheDocument();
  });

  it('omits description element when description is not given', () => {
    const { container } = render(
      <StatsCounter label="Contratos" value="100" />,
    );
    // No description paragraph should exist
    expect(container.querySelectorAll('p')).toHaveLength(2); // value + label only
  });
});
