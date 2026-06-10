export function formatPrice(value, currency = 'USD') {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '—';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value);
}

export function formatRating(rating) {
  if (typeof rating !== 'number') return '0.0';
  return rating.toFixed(1);
}

export function titleCase(value) {
  if (!value) return '';
  return value
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
