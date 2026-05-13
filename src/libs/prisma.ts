import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

declare global {
	var prisma: PrismaClient | undefined;
}

function createPrismaClient() {
	const connectionString = process.env.DATABASE_URL;

	if (!connectionString) {
		throw new Error('DATABASE_URL environment variable is not set');
	}

	const pool = new Pool({
		connectionString,
		ssl:
			process.env.NODE_ENV === 'production'
				? { rejectUnauthorized: false }
				: false,
	});

	return new PrismaClient({
		adapter: new PrismaPg(pool),
		log:
			process.env.NODE_ENV === 'development'
				? ['query', 'warn', 'error']
				: ['error'],
	});
}

export const prisma = global.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
	global.prisma = prisma;
}
