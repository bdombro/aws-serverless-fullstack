import app from './app'

const
  address = process.env.ADDRESS || '0.0.0.0'
  ,port = process.env.PORT || 8080

app.listen(port, address, (err, address) => {
  if (err) throw err
  app.log.info(`server listening on ${address}`)
})
