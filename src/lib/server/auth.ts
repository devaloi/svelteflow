import { hashSync, compareSync } from 'bcryptjs';
import { randomUUID } from 'crypto';
import { db } from './db';
import { users, sessions } from './schema';
import { eq, and, gt } from 'drizzle-orm';
import type { UserRecord } from '$lib/types/auth';

const SESSION_DURATION_HOURS = 24;

export function hashPassword(password: string): string {
	return hashSync(password, 10);
}

export function verifyPassword(password: string, hash: string): boolean {
	return compareSync(password, hash);
}

export function createSession(userId: number): string {
	const token = randomUUID();
	const expiresAt = new Date(Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000).toISOString();

	db.insert(sessions).values({ userId, token, expiresAt }).run();

	return token;
}

export function validateSession(token: string): UserRecord | null {
	const now = new Date().toISOString();

	const result = db
		.select({
			id: users.id,
			email: users.email,
			name: users.name,
			role: users.role,
			createdAt: users.createdAt
		})
		.from(sessions)
		.innerJoin(users, eq(sessions.userId, users.id))
		.where(and(eq(sessions.token, token), gt(sessions.expiresAt, now)))
		.get();

	if (!result) return null;

	return result as UserRecord;
}

export function destroySession(token: string): void {
	db.delete(sessions).where(eq(sessions.token, token)).run();
}

export function findUserByEmail(email: string) {
	return db.select().from(users).where(eq(users.email, email)).get();
}
