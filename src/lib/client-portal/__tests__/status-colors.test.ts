import { describe, it, expect } from 'vitest';
import { getStatusColor, getPriorityColor, getHealthColor } from '../status-colors';

describe('getStatusColor', () => {
  it.each([
    ['active', 'bg-green-100 text-green-800 border-green-200'],
    ['completed', 'bg-blue-100 text-blue-800 border-blue-200'],
    ['paused', 'bg-yellow-100 text-yellow-800 border-yellow-200'],
    ['planning', 'bg-purple-100 text-purple-800 border-purple-200'],
    ['review', 'bg-orange-100 text-orange-800 border-orange-200'],
    ['published', 'bg-green-100 text-green-800 border-green-200'],
    ['scheduled', 'bg-blue-100 text-blue-800 border-blue-200'],
    ['approved', 'bg-green-100 text-green-800 border-green-200'],
    ['revision_needed', 'bg-orange-100 text-orange-800 border-orange-200'],
    ['draft', 'bg-fm-neutral-100 text-fm-neutral-800 border-fm-neutral-200'],
    ['open', 'bg-blue-100 text-blue-800 border-blue-200'],
    ['in-progress', 'bg-yellow-100 text-yellow-800 border-yellow-200'],
    ['resolved', 'bg-green-100 text-green-800 border-green-200'],
    ['closed', 'bg-fm-neutral-100 text-fm-neutral-800 border-fm-neutral-200'],
  ])('returns correct classes for "%s"', (status, expected) => {
    expect(getStatusColor(status)).toBe(expected);
  });

  it('is case-insensitive', () => {
    expect(getStatusColor('ACTIVE')).toBe('bg-green-100 text-green-800 border-green-200');
    expect(getStatusColor('Completed')).toBe('bg-blue-100 text-blue-800 border-blue-200');
  });

  it('returns default for unknown status', () => {
    expect(getStatusColor('unknown')).toBe('bg-fm-neutral-100 text-fm-neutral-800 border-fm-neutral-200');
  });
});

describe('getPriorityColor', () => {
  it.each([
    ['critical', 'bg-red-500'],
    ['urgent', 'bg-red-500'],
    ['high', 'bg-orange-500'],
    ['medium', 'bg-yellow-500'],
    ['low', 'bg-green-500'],
  ])('returns correct class for "%s"', (priority, expected) => {
    expect(getPriorityColor(priority)).toBe(expected);
  });

  it('is case-insensitive', () => {
    expect(getPriorityColor('HIGH')).toBe('bg-orange-500');
  });

  it('returns default for unknown priority', () => {
    expect(getPriorityColor('unknown')).toBe('bg-fm-neutral-500');
  });
});

describe('getHealthColor', () => {
  it.each([
    ['excellent', 'text-green-600'],
    ['good', 'text-blue-600'],
    ['warning', 'text-yellow-600'],
    ['critical', 'text-red-600'],
  ])('returns correct class for "%s"', (health, expected) => {
    expect(getHealthColor(health)).toBe(expected);
  });

  it('is case-insensitive', () => {
    expect(getHealthColor('EXCELLENT')).toBe('text-green-600');
  });

  it('returns default for unknown health', () => {
    expect(getHealthColor('unknown')).toBe('text-fm-neutral-600');
  });
});
