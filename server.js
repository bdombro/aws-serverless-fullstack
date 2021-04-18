const 
  fastify = require('./src/app')
  ,address = process.env.ADDRESS || '0.0.0.0'
  ,port = process.env.PORT || 8080

fastify.listen(port, address, (err, address) => {
  if (err) throw err
  fastify.log.info(`server listening on ${address}`)
})
