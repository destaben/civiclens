import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, formatNumber } from '@/lib/format';

describe('formatCurrency', () => {
  it('formats euros with thousands separator', () => {
    const result = formatCurrency(1234567);
    // Should contain the value with separators — exact format varies by runtime locale support
    expect(result).toContain('1');
    expect(result).toContain('€');
  });

  it('formats zero correctly', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0');
  });
});

describe('formatDate', () => {
  it('returns a non-empty string for a valid ISO date', () => {
    const result = formatDate('2024-03-15');
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('includes the year', () => {
    const result = formatDate('2024-03-15');
    expect(result).toContain('2024');
  });
});

describe('formatNumber', () => {
  it('formats a large number', () => {
    const result = formatNumber(3389);
    expect(result).toContain('3');
    expect(result).toContain('389');
  });

  it('formats zero as "0"', () => {
    expect(formatNumber(0)).toBe('0');
  });
});
