import fastify from 'fastify'
import compressPlugin from 'fastify-compress'
import cookiePlugin from 'fastify-cookie'
import fileUploadPlugin from 'fastify-file-upload'
import helmetPlugin from 'fastify-helmet'
import staticPlugin from 'fastify-static'
import * as fs from 'fs'
import * as helmet from 'helmet'
import * as path from 'path'

import dataStorage from './lib/dataStorage'
import env from './lib/env'
import fileStorage from './lib/fileStorage'
import { pick } from './lib/objects'
import { ForbiddenError, NotFoundError, RequiredError, ValidationErrorSet, ValueError } from './lib/validation'


const 
	prefix = '/api'
	,htmlPath = path.join(__dirname, '/html')
	,notFoundHtml = fs.readFileSync(path.join(htmlPath, '/not-found.html'))
	,isProd = process.env.NODE_ENV === 'production'
	,secrets = (process.env.cookieSecret || 'serverlesssupersecretcookiesecret').split(',')
	,app = fastify({
		logger: true,
		...!isProd ? {
			http2: true,
			https: { 
				allowHTTP1: true, 
				key: fs.readFileSync(__dirname + '/../snowpack.key', 'utf8'), 
				cert: fs.readFileSync(__dirname + '/../snowpack.crt', 'utf8'),
			},
		} : {}
	})

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
app.register(cookiePlugin, { secret: secrets })
app.register(fileUploadPlugin, { limits: { fileSize: 50 * 1024 * 1024 }})
 

app.register(staticPlugin, { root: htmlPath })

app.get('/env', (request, reply) => {
	reply.send(env)
})

app.get('/db-check', async (request, reply) => {
	const result = await dataStorage.query('SHOW DATABASES')
	reply.send('pong')
})

app.post('/files/:id', async (request, reply) => {
	const {id} = request.params as Record<string, string>
	const files = request.raw.files || {}
	const file = files?.file
	if (!file)
		throw new ValidationErrorSet({}, {file: new RequiredError('file')})
	await fileStorage.put(id, file.data, file.mimetype)
	reply.code(201).send('success')
})
app.get('/files/:id', async (request, reply) => {
	const {id} = request.params as Record<string, string>
	try {
		const file = await fileStorage.get(id)
		reply.type(file.contentType).send(file.data)
	} catch(err) {
		if (err.code === 'ENOENT')
			throw new NotFoundError()
		throw err
	}
})
app.get('/files/:id/meta', async (request, reply) => {
	const {id} = request.params as Record<string, string>
	try {
		const file = await fileStorage.get(id)
		reply.send(pick(file, ['contentType', 'createdAt']))
	} catch(err) {
		if (err.code === 'ENOENT')
			throw new NotFoundError()
		throw err
	}
})



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


export class InternalServerError extends Error {
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

