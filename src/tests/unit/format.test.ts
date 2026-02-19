import { describe, it, expect } from 'vitest';
import {
	formatCurrency,
	formatPercent,
	formatNumber,
	formatDate,
	formatRelativeTime
} from '$lib/utils/format';

describe('formatCurrency', () => {
	it('formats positive numbers as USD', () => {
		expect(formatCurrency(1234.56)).toBe('$1,234.56');
	});

	it('formats zero', () => {
		expect(formatCurrency(0)).toBe('$0.00');
	});

	it('formats large numbers', () => {
		expect(formatCurrency(1000000)).toBe('$1,000,000.00');
	});
});

describe('formatPercent', () => {
	it('formats with one decimal place', () => {
		expect(formatPercent(42.567)).toBe('42.6%');
	});

	it('formats zero', () => {
		expect(formatPercent(0)).toBe('0.0%');
	});
});

describe('formatNumber', () => {
	it('formats with thousands separator', () => {
		expect(formatNumber(1234567)).toBe('1,234,567');
	});

	it('rounds to nearest integer', () => {
		expect(formatNumber(42.7)).toBe('43');
	});
});

describe('formatDate', () => {
	it('formats ISO date string', () => {
		const result = formatDate('2025-01-15T10:00:00Z');
		expect(result).toMatch(/Jan 15, 2025/);
	});
});

describe('formatRelativeTime', () => {
	it('returns seconds ago for recent times', () => {
		const now = new Date(Date.now() - 30 * 1000).toISOString();
		expect(formatRelativeTime(now)).toBe('30s ago');
	});

	it('returns minutes ago', () => {
		const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
		expect(formatRelativeTime(fiveMinAgo)).toBe('5m ago');
	});

	it('returns hours ago', () => {
		const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
		expect(formatRelativeTime(threeHoursAgo)).toBe('3h ago');
	});

	it('returns days ago', () => {
		const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
		expect(formatRelativeTime(twoDaysAgo)).toBe('2d ago');
	});
});
