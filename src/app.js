const {dbArn, dbSecretArn, dbName} = process.env

const fastify = require('fastify')({
  logger: true
})

fastify.get('/', (request, reply) => {
  reply.send({ hello: 'world' })
})

fastify.get('/config', (request, reply) => {
  reply.send({ dbArn, dbSecretArn, dbName })
})

fastify.get('/dbcheck', async (request, reply) => {
  const data = require('data-api-client')({
    secretArn: dbSecretArn,
    resourceArn: dbArn,
    database: dbName,
  })

  let result = await data.query(`SHOW DATABASES`)
  reply.send(result)
})

module.exports = fastify
