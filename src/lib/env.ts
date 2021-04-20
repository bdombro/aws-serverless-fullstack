/**
 * An interface for isomorphic env variable access
 */
import { pick } from './objects'

const pe = process.env as Record<string, string>

const isProd = process.env.NODE_ENV === 'production'

const lambdaVars = ['dbName', 'dbArn', 'dbSecretArn', 's3Bucket'] as const
const lambdaEnv = pick(pe, lambdaVars)
const localVars = ['dbName', 'dbHost', 'dbUser', 'dbPassword'] as const
const localEnv = pick(pe, localVars)

const currentVars = isProd ? lambdaVars : localVars
const currentEnv = isProd ? lambdaEnv : localEnv

// @ts-ignore: env checker uncertainty
const missing = currentVars.filter(v => !currentEnv[v])
if (missing.length)
	throw new Error('Env is missing ' + missing)

export default {
	isProd,
	...lambdaEnv,
	...localEnv,
}


