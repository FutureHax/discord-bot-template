import { describe, it, expect } from 'vitest';
const { formatNumber, truncate, snowflakeToDate, randomString } = require('./helpers');

describe('formatNumber', () => {
  it('formats numbers with commas', () => {
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(1000000)).toBe('1,000,000');
    expect(formatNumber(123)).toBe('123');
  });
});

describe('truncate', () => {
  it('truncates long strings', () => {
    const long = 'a'.repeat(200);
    const result = truncate(long, 100);
    expect(result.length).toBe(100);
    expect(result.endsWith('...')).toBe(true);
  });

  it('returns short strings unchanged', () => {
    expect(truncate('hello', 100)).toBe('hello');
  });
});

describe('snowflakeToDate', () => {
  it('converts Discord snowflake to date', () => {
    // Known snowflake: 175928847299117063 is from 2016-04-30
    const date = snowflakeToDate('175928847299117063');
    expect(date.getFullYear()).toBe(2016);
    expect(date.getMonth()).toBe(3); // April (0-indexed)
  });
});

describe('randomString', () => {
  it('generates string of specified length', () => {
    expect(randomString(10).length).toBe(10);
    expect(randomString(32).length).toBe(32);
  });

  it('generates different strings', () => {
    const a = randomString(16);
    const b = randomString(16);
    expect(a).not.toBe(b);
  });
});