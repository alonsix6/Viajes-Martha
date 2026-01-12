import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Format currency amount in Soles (S/.)
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return `S/. ${Number(amount).toFixed(2)}`;
};

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @param {string} formatString - Format pattern (default: 'dd MMM')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, formatString = 'dd MMM') => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatString, { locale: es });
};

/**
 * Format month and year (e.g., "ENERO 2025")
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted month and year string
 */
export const formatMonthYear = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMMM yyyy', { locale: es }).toUpperCase();
};

/**
 * Get current month and year
 * @returns {object} Object with month and year properties
 */
export const getCurrentMonth = () => {
  const now = new Date();
  return {
    month: now.getMonth() + 1,
    year: now.getFullYear()
  };
};

/**
 * Format date for input type="date"
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string (YYYY-MM-DD)
 */
export const formatDateForInput = (date) => {
  if (!date) {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return dateObj.toISOString().split('T')[0];
};

/**
 * Validate and parse amount input
 * @param {string} input - Input string
 * @returns {number|null} Parsed number or null if invalid
 */
export const parseAmount = (input) => {
  const cleaned = String(input).replace(/[^\d.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
};

/**
 * Group transactions by month
 * @param {Array} transactions - Array of transactions
 * @returns {Object} Transactions grouped by month
 */
export const groupByMonth = (transactions) => {
  const grouped = {};

  transactions.forEach(transaction => {
    const monthKey = formatMonthYear(transaction.date);
    if (!grouped[monthKey]) {
      grouped[monthKey] = [];
    }
    grouped[monthKey].push(transaction);
  });

  return grouped;
};

export default {
  formatCurrency,
  formatDate,
  formatMonthYear,
  getCurrentMonth,
  formatDateForInput,
  parseAmount,
  groupByMonth
};
