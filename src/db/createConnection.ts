import type { ConnectionOptions } from 'typeorm'
import { createConnection as tCreateConnection } from 'typeorm'

import env from '../lib/env'

/**
 * Calls a memoized typeorm.createConnection. By memoizing, it can be 
 * called from anywhere without worrying about opening multiple connections.
 */
export default function createConnection() {
	return createConnectionM()
		.catch(e => {
			createConnectionM.bust()
			throw e
		})
}

/**
 * Calls typeorm.createConnection with the proper config. On local, Typeorm
 * will just check <root>/ormconfig.js.
 * 
 * I tried to add logic in ormconfig.js to switch based on env, but Lambda 
 * barfed for some reason.
 */
async function createConnectionRaw() {
	return env.isProd ? tCreateConnection(prodOrmconfig) : tCreateConnection()
}

/**
 * Memoize createConnection so that it can be called from anywhere without
 * worrying about opening multiple connections.
 */
const createConnectionM = Function.memoize(createConnectionRaw)


const prodOrmconfig: ConnectionOptions = {
	type: 'aurora-data-api',
	region: env.region,
	secretArn: env.dbSecretArn,
	resourceArn: env.dbArn,
	database: env.dbName,
	serviceConfigOptions: { maxRetries: 8 },
	// synchronize: true,
	migrationsRun: true,
	entities: 		['src/db/entity/**/entity.js'],
	migrations: 	['src/db/migration/**/*.js'],
	subscribers: 	['src/db/subscriber/**/*.js'],
}