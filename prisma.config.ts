import { defineConfig, env } from 'prisma/config';

const loadEnvFile = (process as NodeJS.Process & { loadEnvFile?: () => void })
	.loadEnvFile;

loadEnvFile?.();

export default defineConfig({
	schema: 'prisma/schema.prisma',
	migrations: {
		path: 'prisma/migrations',
	},
	datasource: {
		url: env('DATABASE_URL'),
	},
});
