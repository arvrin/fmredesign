import { describe, it, expect } from 'vitest';
import {
  getWorkloadColor,
  getLocationEmoji,
  getPlatformColor,
  formatDate,
  formatDateTime,
  formatCurrency,
} from '../format-helpers';

describe('getWorkloadColor', () => {
  it('returns red for workload >= 100', () => {
    expect(getWorkloadColor(100)).toBe('text-red-600');
    expect(getWorkloadColor(150)).toBe('text-red-600');
  });

  it('returns orange for workload 80-99', () => {
    expect(getWorkloadColor(80)).toBe('text-orange-600');
    expect(getWorkloadColor(99)).toBe('text-orange-600');
  });

  it('returns yellow for workload 60-79', () => {
    expect(getWorkloadColor(60)).toBe('text-yellow-600');
    expect(getWorkloadColor(79)).toBe('text-yellow-600');
  });

  it('returns green for workload < 60', () => {
    expect(getWorkloadColor(0)).toBe('text-green-600');
    expect(getWorkloadColor(59)).toBe('text-green-600');
  });
});

describe('getLocationEmoji', () => {
  it('returns office emoji', () => {
    expect(getLocationEmoji('office')).toBe('\u{1F3E2}');
  });

  it('returns remote emoji', () => {
    expect(getLocationEmoji('remote')).toBe('\u{1F3E0}');
  });

  it('returns hybrid emoji', () => {
    expect(getLocationEmoji('hybrid')).toBe('\u{1F504}');
  });

  it('returns pin emoji for unknown location', () => {
    expect(getLocationEmoji('unknown')).toBe('\u{1F4CD}');
    expect(getLocationEmoji('')).toBe('\u{1F4CD}');
  });
});

describe('getPlatformColor', () => {
  it('returns correct colors for known platforms', () => {
    expect(getPlatformColor('instagram')).toContain('bg-pink-100');
    expect(getPlatformColor('facebook')).toContain('bg-blue-100');
    expect(getPlatformColor('youtube')).toContain('bg-red-100');
    expect(getPlatformColor('twitter')).toContain('bg-sky-100');
    expect(getPlatformColor('tiktok')).toContain('bg-neutral-900');
    expect(getPlatformColor('website')).toContain('bg-green-100');
    expect(getPlatformColor('email')).toContain('bg-purple-100');
    expect(getPlatformColor('blog')).toContain('bg-emerald-100');
  });

  it('is case-insensitive', () => {
    expect(getPlatformColor('Instagram')).toContain('bg-pink-100');
    expect(getPlatformColor('FACEBOOK')).toContain('bg-blue-100');
  });

  it('returns neutral for unknown platform', () => {
    expect(getPlatformColor('mastodon')).toContain('bg-fm-neutral-100');
  });
});

describe('formatDate', () => {
  it('formats a valid date string', () => {
    const result = formatDate('2025-03-15T10:00:00Z');
    expect(result).toContain('Mar');
    expect(result).toContain('15');
    expect(result).toContain('2025');
  });

  it('returns N/A for null', () => {
    expect(formatDate(null)).toBe('N/A');
  });

  it('returns N/A for undefined', () => {
    expect(formatDate(undefined)).toBe('N/A');
  });

  it('returns N/A for empty string', () => {
    expect(formatDate('')).toBe('N/A');
  });
});

describe('formatDateTime', () => {
  it('formats a valid date with time', () => {
    const result = formatDateTime('2025-03-15T10:30:00Z');
    expect(result).toContain('Mar');
    expect(result).toContain('15');
    expect(result).toContain('2025');
  });

  it('returns N/A for null', () => {
    expect(formatDateTime(null)).toBe('N/A');
  });

  it('returns N/A for undefined', () => {
    expect(formatDateTime(undefined)).toBe('N/A');
  });
});

describe('formatCurrency', () => {
  it('formats amount in INR', () => {
    const result = formatCurrency(150000);
    // Indian locale uses ₹ symbol and lakh grouping
    expect(result).toContain('₹');
    expect(result).toContain('1,50,000');
  });

  it('formats zero', () => {
    const result = formatCurrency(0);
    expect(result).toContain('₹');
    expect(result).toContain('0');
  });

  it('formats large amounts', () => {
    const result = formatCurrency(10000000);
    expect(result).toContain('₹');
    expect(result).toContain('1,00,00,000');
  });
});
