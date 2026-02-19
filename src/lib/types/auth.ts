export interface UserRecord {
	id: number;
	email: string;
	name: string;
	role: 'admin' | 'user';
	createdAt: string;
}

export interface SessionRecord {
	id: number;
	userId: number;
	token: string;
	expiresAt: string;
}
