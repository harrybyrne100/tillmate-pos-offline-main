/**
 * Money utilities for EUR currency handling
 * All amounts are stored in cents to avoid floating point issues
 */

/**
 * Format cents as EUR currency string
 * @param cents - Amount in cents
 * @returns Formatted currency string (e.g., "€12.34")
 */
export function fmt(cents: number): string {
  if (typeof cents !== 'number' || !Number.isFinite(cents)) {
    return '€0.00';
  }
  
  const euros = cents / 100;
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(euros);
}

/**
 * Convert number or string to cents
 * @param input - Amount in euros (number or string)
 * @returns Amount in cents
 */
export function cents(input: number | string): number {
  if (typeof input === 'number') {
    if (!Number.isFinite(input)) {
      return 0;
    }
    return Math.round(input * 100);
  }
  
  if (typeof input === 'string') {
    // Remove common currency symbols and whitespace
    const cleaned = input.replace(/[€$£,\s]/g, '').trim();
    const parsed = parseFloat(cleaned);
    
    if (!Number.isFinite(parsed)) {
      return 0;
    }
    
    return Math.round(parsed * 100);
  }
  
  return 0;
}

/**
 * Get day key from date (YYYY-MM-DD format)
 * @param d - Date object (defaults to current date)
 * @returns Day key string
 */
export function dayKeyOf(d: Date = new Date()): string {
  if (!(d instanceof Date) || !Number.isFinite(d.getTime())) {
    d = new Date();
  }
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}
