/**
 * An interface for isomorphic MySql data storage
 */

import env from "./env"

function createRdsClient() {
  const client = require('data-api-client')({
    secretArn: env.dbSecretArn,
    resourceArn: env.dbArn,
    database: env.dbName,
  })
  return {
    query(queryStr: string) {
      // @ts-ignore: query is type-unsafe
      return client.query(queryStr).then(({records}) => records as any[])
    }
  }
}

function createLocalClient() {
  const client = require('mysql2').createConnection({
    host: env.dbHost,
    database: env.dbName,
    user: env.dbUser,
    password: env.dbPassword
  }).promise()
  return {
    query(queryStr: string) {
      // @ts-ignore: query is type-unsafe
      return client.query(queryStr).then(([rows,fields]) => rows as any[])
    }
  }
}

const client = env.isProd ? createRdsClient() : createLocalClient()

export default {
  async query(queryStr: string) {
		return client.query(queryStr)
  }
}