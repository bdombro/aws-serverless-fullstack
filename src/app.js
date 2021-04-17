const express = require('express')
const { getCurrentInvoke } = require('@vendia/serverless-express')
const app = express()
const router = express.Router()

router.get('/', (req, res) => {
  const currentInvoke = getCurrentInvoke()
  const { event = {} } = currentInvoke
  const {
    requestContext = {}
  } = event
  const {
    domainName = 'localhost:3000'
  } = requestContext
  const apiUrl = `https://${domainName}`
  res.json({hello: apiUrl})
})

router.get('/inner', (req, res) => {
  res.json({hello: 'inner'})
})

router.get('/vendia', (req, res) => {
  res.sendFile(path.join(__dirname, 'vendia-logo.png'))
})

// The serverless-express library creates a server and listens on a Unix
// Domain Socket for you, so you can remove the usual call to app.listen.
// app.listen(3000)
app.use('/', router)

// Export your express server so you can import it in the lambda function.
module.exports = app
