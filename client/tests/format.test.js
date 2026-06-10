import { describe, it, expect } from 'vitest';
import { formatPrice, formatRating, titleCase } from '../src/utils/format';

describe('formatPrice', () => {
  it('formats a number as USD currency', () => {
    expect(formatPrice(129.99)).toBe('$129.99');
  });

  it('returns a dash for non-numeric input', () => {
    expect(formatPrice('nope')).toBe('—');
    expect(formatPrice(NaN)).toBe('—');
  });
});

describe('formatRating', () => {
  it('formats to one decimal place', () => {
    expect(formatRating(4.6)).toBe('4.6');
    expect(formatRating(5)).toBe('5.0');
  });

  it('defaults to 0.0 for invalid input', () => {
    expect(formatRating(undefined)).toBe('0.0');
  });
});

describe('titleCase', () => {
  it('capitalises each word', () => {
    expect(titleCase('wireless headphones')).toBe('Wireless Headphones');
  });

  it('returns an empty string for falsy input', () => {
    expect(titleCase('')).toBe('');
  });
});
