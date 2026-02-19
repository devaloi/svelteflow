import { describe, it, expect } from 'vitest';
import { toCSV } from '$lib/utils/csv';

describe('toCSV', () => {
	it('converts array of objects to CSV string', () => {
		const rows = [
			{ name: 'Alice', age: 30 },
			{ name: 'Bob', age: 25 }
		];
		const result = toCSV(rows);
		expect(result).toBe('name,age\nAlice,30\nBob,25');
	});

	it('returns empty string for empty array', () => {
		expect(toCSV([])).toBe('');
	});

	it('escapes commas in values', () => {
		const rows = [{ name: 'Doe, Jane', city: 'NY' }];
		const result = toCSV(rows);
		expect(result).toBe('name,city\n"Doe, Jane",NY');
	});

	it('escapes double quotes in values', () => {
		const rows = [{ quote: 'He said "hello"' }];
		const result = toCSV(rows);
		expect(result).toBe('quote\n"He said ""hello"""');
	});

	it('escapes newlines in values', () => {
		const rows = [{ note: 'line1\nline2' }];
		const result = toCSV(rows);
		expect(result).toBe('note\n"line1\nline2"');
	});

	it('handles null and undefined values', () => {
		const rows = [{ a: null, b: undefined, c: 'ok' }];
		const result = toCSV(rows);
		expect(result).toBe('a,b,c\n,,ok');
	});

	it('handles large datasets', () => {
		const rows = Array.from({ length: 1000 }, (_, i) => ({ id: i, value: `item-${i}` }));
		const result = toCSV(rows);
		const lines = result.split('\n');
		expect(lines.length).toBe(1001);
	});
});
