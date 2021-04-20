import fastify from 'fastify'
import compressPlugin from 'fastify-compress'
import fileUploadPlugin from 'fastify-file-upload'
import helmetPlugin from 'fastify-helmet'
import jwtPlugin from 'fastify-jwt'
import staticPlugin from 'fastify-static'
import * as fs from 'fs'
import * as helmet from 'helmet'
import * as path from 'path'

import dataStorage from './lib/dataStorage'
import env from './lib/env'
import fileStorage from './lib/fileStorage'
import { pick } from './lib/objects'
import { ForbiddenError, NotFoundError, RequiredError, ValidationErrorSet, ValueError } from './lib/validation'

declare module 'fastify-jwt' {
  interface FastifyJWT {payload: {id: string, roles: number[], createdAt: number}}
}

const 
	prefix = '/api'
	,htmlPath = path.join(__dirname, '/html')
	,notFoundHtml = fs.readFileSync(path.join(htmlPath, '/not-found.html'))
	,app = fastify({
		logger: true,
		...!env.isProd ? {
			http2: true,
			https: { 
				allowHTTP1: true, 
				key: fs.readFileSync(__dirname + '/../ssl.key', 'utf8'), 
				cert: fs.readFileSync(__dirname + '/../ssl.crt', 'utf8'),
			},
		} : {}
	})

///////////////////////////////
// Plugins
///////////////////////////////
app.register(helmetPlugin, { 
	prefix,
	contentSecurityPolicy: {
		directives: {
			...helmet.contentSecurityPolicy.getDefaultDirectives(),
			'script-src': ['\'self\'', 'https: \'unsafe-inline\'']
		},
	},
})
app.register(compressPlugin, { threshold: 800 }) // default = 1024
app.register(fileUploadPlugin, { limits: { fileSize: 50 * 1024 * 1024 }})
app.register(staticPlugin, { root: htmlPath })
app.register(jwtPlugin, { secret: env.authSecret, verify: {maxAge: '30d'}})


///////////////////////////////
// Authorization
///////////////////////////////
app.addHook('onRequest', async (req, reply) => {
	try {await req.jwtVerify()}
	catch (err) {req.user = { id: '', roles: [], createdAt: 0 }}
})
app.post('/auth/login', async (req, reply) => {
	const {email, password} = req.body as Record<string, string>
	if (!email)
		throw new ValidationErrorSet(req.body, {email: new RequiredError('email')})
	if (!password)
		throw new ValidationErrorSet(req.body, {password: new RequiredError('password')})
	// const user = await UserEntity.findOne({ where: { email } })
	// if (!(user && await user.comparePassword(password)))
	// 	throw new FormValidationErrorSet(props, 'email and/or password invalid')
	const token = app.jwt.sign({ id: '1234', roles: [0], createdAt: Date.now() })
	reply.send({token})
})
app.post('/auth/refresh', async (req, reply) => {
	if (!req.user.id)
		throw new ValidationErrorSet({}, {Authorization: new RequiredError('authorization')})
	// const user = await UserEntity.findOne({ where: { id: req.user.id } })
	// if (!user) throw new Error('User in token was somehow deleted...?')
	// const passwordChanged = req.user.createdAt < user.passwordUpdatedAt.getTime()
	// const isBanned = user.status === UserStatus.BANNED
	// if (!user || passwordChanged || isBanned) 
	// 	throw new ForbiddenError()
	const token = app.jwt.sign({ id: '1234', roles: [0], createdAt: Date.now() })
	reply.send({token})
})
app.get('/auth', async (req, reply) => {
	reply.send(req.user)
})


///////////////////////////////
// DB Health Check
///////////////////////////////
app.get('/db-ping', async (req, reply) => {
	await dataStorage.query('SHOW DATABASES')
	reply.send('pong')
})


///////////////////////////////
// File Storage Demo
///////////////////////////////
app.post('/files/:id', async (req, reply) => {
	const {id} = req.params as Record<string, string>
	const files = req.raw.files || {}
	const file = files?.file
	if (!file)
		throw new ValidationErrorSet({}, {file: new RequiredError('file')})
	await fileStorage.put(id, file.data, file.mimetype)
	reply.code(201).send('success')
})
app.get('/files/:id', async (req, reply) => {
	const {id} = req.params as Record<string, string>
	try {
		const file = await fileStorage.get(id)
		reply.type(file.contentType).send(file.data)
	} catch(err) {
		if (err.code === 'ENOENT')
			throw new NotFoundError()
		throw err
	}
})
app.get('/files/:id/meta', async (req, reply) => {
	const {id} = req.params as Record<string, string>
	try {
		const file = await fileStorage.get(id)
		reply.send(pick(file, ['contentType', 'createdAt']))
	} catch(err) {
		if (err.code === 'ENOENT')
			throw new NotFoundError()
		throw err
	}
})


///////////////////////////////
// Not Found / Error Handling
///////////////////////////////
app.setNotFoundHandler((req, reply) => { reply.type('text/html').send(notFoundHtml) })
app.setErrorHandler(async function errorHandler(error, req, reply) {
	req.log.error(error as any, error.message)
	if (error instanceof NotFoundError)
		reply.code(404).type('text/html').send(notFoundHtml)
	else if (error instanceof ForbiddenError)
		reply.code(403).send({ error })
	else if (error instanceof ValidationErrorSet)
		reply.code(400).send({ error })
	else
		reply.code(500).send({ error: new InternalServerError(error.message) })
})


export default app


///////////////////////////////
// Errors
///////////////////////////////
class InternalServerError extends Error {
	type = 'InternalServerError'
	note: string
	context: {
		entity: any,
		errorSet: Record<string, string>,
	}
	constructor(message: string, entity?: any) {
		super(message)
		this.note = message
		this.context = {
			entity,
			errorSet: {},
		}
	}
}

