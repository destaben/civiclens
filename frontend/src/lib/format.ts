/**
 * Locale-aware formatting utilities.
 *
 * Always use these helpers instead of manually concatenating strings so that
 * numbers and dates are rendered correctly for the active locale.
 */

const DEFAULT_LOCALE = 'es-ES';

/**
 * Format a monetary amount with currency symbol.
 *
 * @example formatCurrency(1234567.89) → "1.234.568 €"
 */
export function formatCurrency(
  amount: number,
  currency = 'EUR',
  locale = DEFAULT_LOCALE,
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a date string (ISO 8601) for display.
 *
 * @example formatDate('2024-03-15') → "15 mar 2024"
 */
export function formatDate(
  isoDate: string,
  locale = DEFAULT_LOCALE,
): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(isoDate));
}

/**
 * Format a plain number with thousands separators.
 *
 * @example formatNumber(3389) → "3.389"
 */
export function formatNumber(
  value: number,
  locale = DEFAULT_LOCALE,
): string {
  return new Intl.NumberFormat(locale).format(value);
}
