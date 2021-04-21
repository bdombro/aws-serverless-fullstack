import { createConnection } from 'typeorm'

import env from './env'

if (env.isProd) createConnection({
	type: 'aurora-data-api',
	region: env.region,
	secretArn: env.dbSecretArn,
	resourceArn: env.dbArn,
	database: env.dbName,
	serviceConfigOptions: { maxRetries: 4 },
	// synchronize: true,
	migrationsRun: true,
	entities: 		['src/db/entity/**/entity.js'],
	migrations: 	['src/db/migration/**/*.js'],
	subscribers: 	['src/db/subscriber/**/*.js'],
})
else createConnection()