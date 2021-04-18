const fastify = require('fastify')({
  logger: true
})

fastify.get('/', (request, reply) => {
  reply.send({ hello: 'world' })
})

fastify.get('/inner', (request, reply) => {
  reply.send({ hello: 'inner' })
})

module.exports = fastify
