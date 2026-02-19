import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from '$lib/server/auth';

describe('password hashing', () => {
	it('hashes a password', () => {
		const hash = hashPassword('secret123');
		expect(hash).toBeTruthy();
		expect(hash).not.toBe('secret123');
	});

	it('verifies correct password', () => {
		const hash = hashPassword('mypassword');
		expect(verifyPassword('mypassword', hash)).toBe(true);
	});

	it('rejects wrong password', () => {
		const hash = hashPassword('mypassword');
		expect(verifyPassword('wrongpassword', hash)).toBe(false);
	});

	it('generates different hashes for same password', () => {
		const hash1 = hashPassword('same');
		const hash2 = hashPassword('same');
		expect(hash1).not.toBe(hash2);
	});

	it('handles empty password', () => {
		const hash = hashPassword('');
		expect(hash).toBeTruthy();
		expect(verifyPassword('', hash)).toBe(true);
	});
});
