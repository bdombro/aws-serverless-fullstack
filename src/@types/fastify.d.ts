import type { FastifyInstance as FastifyInstanceSrc } from 'fastify'

declare global {
	type FastifyInstance = FastifyInstanceSrc
}

declare module 'fastify' {
	interface FastifyRequest {
		hello: any
	}
}