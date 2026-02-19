import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	name: text('name').notNull(),
	role: text('role', { enum: ['admin', 'user'] })
		.notNull()
		.default('user'),
	createdAt: text('created_at')
		.notNull()
		.$defaultFn(() => new Date().toISOString())
});

export const sessions = sqliteTable('sessions', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id),
	token: text('token').notNull().unique(),
	expiresAt: text('expires_at').notNull()
});

export const sales = sqliteTable('sales', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	product: text('product').notNull(),
	amount: real('amount').notNull(),
	customer: text('customer').notNull(),
	region: text('region').notNull(),
	createdAt: text('created_at')
		.notNull()
		.$defaultFn(() => new Date().toISOString())
});

export const metrics = sqliteTable('metrics', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	value: real('value').notNull(),
	unit: text('unit').notNull(),
	recordedAt: text('recorded_at')
		.notNull()
		.$defaultFn(() => new Date().toISOString())
});

export const events = sqliteTable('events', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	type: text('type').notNull(),
	source: text('source').notNull(),
	payload: text('payload').notNull().default('{}'),
	createdAt: text('created_at')
		.notNull()
		.$defaultFn(() => new Date().toISOString())
});
