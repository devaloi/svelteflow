import type { UserRecord } from '$lib/types/auth';

declare global {
	namespace App {
		interface Locals {
			user: UserRecord | null;
		}
	}
}

export {};
