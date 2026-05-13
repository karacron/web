import { defineConfig, env } from 'prisma/config';

const loadEnvFile = (process as NodeJS.Process & { loadEnvFile?: () => void })
	.loadEnvFile;

try {
	loadEnvFile?.();
} catch {
	// En producción no existe .env, se usan las variables de entorno del sistema
}

export default defineConfig({
	schema: 'prisma/schema.prisma',
	migrations: {
		path: 'prisma/migrations',
	},
	datasource: {
		url: process.env.DATABASE_URL ?? env('DATABASE_URL'),
	},
});
