import { describe, it, expect } from 'vitest';
import { parseMetric } from '../useCountUp';

describe('parseMetric', () => {
  it('parses number with percentage and rest text', () => {
    const result = parseMetric('300% avg traffic growth');
    expect(result).toEqual({
      number: 300,
      suffix: '%',
      rest: 'avg traffic growth',
    });
  });

  it('parses number without percentage', () => {
    const result = parseMetric('50 clients served');
    expect(result).toEqual({
      number: 50,
      suffix: '',
      rest: 'clients served',
    });
  });

  it('parses number with percentage only', () => {
    const result = parseMetric('100%');
    expect(result).toEqual({
      number: 100,
      suffix: '%',
      rest: '',
    });
  });

  it('parses standalone number', () => {
    const result = parseMetric('42');
    expect(result).toEqual({
      number: 42,
      suffix: '',
      rest: '',
    });
  });

  it('returns null for non-numeric start', () => {
    expect(parseMetric('no numbers here')).toBeNull();
    expect(parseMetric('')).toBeNull();
  });

  it('handles single digit', () => {
    const result = parseMetric('5 projects');
    expect(result).toEqual({
      number: 5,
      suffix: '',
      rest: 'projects',
    });
  });

  it('parses large numbers', () => {
    const result = parseMetric('10000% ROI increase');
    expect(result).toEqual({
      number: 10000,
      suffix: '%',
      rest: 'ROI increase',
    });
  });
});
