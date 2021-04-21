module.exports = {
	type: 'mysql',
	host: 'localhost',
	port: 3306,
	username: 'root',
	password: 'password',
	database: 'public',
	synchronize: true,
	// migrationsRun: true,
	logging: false,
	entities: [
		'src/db/entity/**/entity.ts'
	],
	migrations: [
		'src/db/migration/**/*.ts'
	],
	subscribers: [
		'src/db/subscriber/**/*.ts'
	],
	cli: {
		entitiesDir: 'src/db/entity',
		migrationsDir: 'src/db/migration',
		subscribersDir: 'src/db/subscriber'
	}
}