import { Connection, createConnection as _createConnection } from 'typeorm'

import env from '../lib/env'

const createConnection = Function.memoize(async function (): Promise<Connection> {
	return (env.isProd 
		? _createConnection({
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
		}) 
		: _createConnection()
	)
	// .catch(() => {
	// 	throw new Error('DB connect failed.')
	// })
})

export default function(): Promise<Connection> {
	return createConnection()
		.catch(e => {
			createConnection.bust()
			throw e
		})
}
