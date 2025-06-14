// src/utils/dateUtils.js

// --- Parse a date from string
export function parseCustomDate(dateString) {
  if (!dateString || typeof dateString !== 'string' || !dateString.trim()) return new Date(0);

  // Try ISO format (YYYY-MM-DD)
  const isoDate = Date.parse(dateString);
  if (!isNaN(isoDate)) return new Date(isoDate);

  // Try DD-MM-YYYY
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      return new Date(year, month, day);
    }
  }

  // Fallback
  const fallbackDate = new Date(dateString);
  return isNaN(fallbackDate) ? new Date(0) : fallbackDate;
}

// --- Format as DD/MM/YYYY
export function formatDateAsDDMMYYYY(date) {
  if (!(date instanceof Date) || isNaN(date)) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// --- Locale-based fallback formatter
export function formatDateLocalized(date) {
  if (!(date instanceof Date) || isNaN(date)) return '';
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// --- Format as "Jun 2024"
export function formatDateAsMonthYear(date) {
  if (!(date instanceof Date) || isNaN(date)) return '';
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

// --- Calculate relative duration
export function calculateDuration(start, end) {
  if (!(start instanceof Date) || isNaN(start) || !(end instanceof Date) || isNaN(end)) {
    return '';
  }

  // Ensure start is before end
  if (start > end) [start, end] = [end, start];

  let startYear = start.getFullYear();
  let startMonth = start.getMonth();
  let startDay = start.getDate();

  let endYear = end.getFullYear();
  let endMonth = end.getMonth();
  let endDay = end.getDate();

  // Calculate initial difference
  let years = endYear - startYear;
  let months = endMonth - startMonth;

  // Adjust total months
  let totalMonths = years * 12 + months;

  // If end date is the last day of the month, include full month
  const isEndLastDayOfMonth = end.getDate() === new Date(end.getFullYear(), end.getMonth() + 1, 0).getDate();

  // If end date is on or after the start day, or last day of month, count this month fully
  if (endDay >= startDay || isEndLastDayOfMonth) {
    totalMonths += 1;
  }

  // Convert back to years and months
  years = Math.floor(totalMonths / 12);
  months = totalMonths % 12;

  const yearStr = years > 0 ? `${years} year${years !== 1 ? 's' : ''}` : '';
  const monthStr = months > 0 ? `${months} month${months !== 1 ? 's' : ''}` : '';

  return [yearStr, monthStr].filter(Boolean).join(', ') || '0 months';
}
