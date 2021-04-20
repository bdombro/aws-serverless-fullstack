
declare module 'http' {
	interface IncomingMessage {
		files: Record<string, any>
	}
}