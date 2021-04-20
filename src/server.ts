import app from './app'
import env from './lib/env'

app.listen(env.PORT, env.ADDRESS, (err, address) => {
	if (err) throw err
	app.log.info(`server listening on ${address}`)
})
