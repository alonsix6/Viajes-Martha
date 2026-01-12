import { format, parseISO, formatDistance } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Format currency amount in Colombian Pesos
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  // TODO: Implement currency formatting
  // Format as Colombian Peso: $XX,XXX or $X,XXX,XXX
  // Handle negative amounts for expenses
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @param {string} formatString - Format pattern (default: 'dd/MM/yyyy')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, formatString = 'dd/MM/yyyy') => {
  // TODO: Implement date formatting
  // Use date-fns with Spanish locale
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatString, { locale: es });
};

/**
 * Format date with time
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (date) => {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
};

/**
 * Format relative time (e.g., "hace 2 horas")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistance(dateObj, new Date(), {
    addSuffix: true,
    locale: es
  });
};

/**
 * Validate and parse amount input
 * @param {string} input - Input string
 * @returns {number|null} Parsed number or null if invalid
 */
export const parseAmount = (input) => {
  // TODO: Implement amount parsing
  // Remove currency symbols and commas
  // Return number or null
  const cleaned = input.replace(/[^\d.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
};

export default {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  parseAmount,
};
