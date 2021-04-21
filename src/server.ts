import './lib/polyfills'

import app from './app'
app.listen(process.env.PORT || 3000, process.env.ADDRESS || '0.0.0.0', (err, address) => {
	if (err) throw err
	app.log.info(`server listening on ${address}`)
})
