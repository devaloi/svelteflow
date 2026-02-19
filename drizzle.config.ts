import type { Config } from 'drizzle-kit';

export default {
	schema: './src/lib/server/schema.ts',
	out: './drizzle/migrations',
	dialect: 'sqlite',
	dbCredentials: {
		url: 'data.db'
	}
} satisfies Config;
