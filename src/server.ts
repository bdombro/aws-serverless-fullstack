import * as fs from 'fs'

import app from './app'

const
	address = process.env.ADDRESS || '0.0.0.0'
	,port = process.env.PORT || 3000

app.listen(port, address, (err, address) => {
	if (err) throw err
	app.log.info(`server listening on ${address}`)
})
