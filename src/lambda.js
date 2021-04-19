const awsLambdaFastify = require('aws-lambda-fastify')
const app = require('./app')

exports.handler = awsLambdaFastify(app)
