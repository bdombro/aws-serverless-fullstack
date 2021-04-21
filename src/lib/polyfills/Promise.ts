/**
 * Extensions for Promise
 */

export {}

declare global {
	interface PromiseConstructor {
		callWithRetry: <T extends any>(callback: () => T, maxTries: number) => Promise<T>
	}
	// interface Promise<T> {
	// 	foo: 'bar'
	// }
}

/**
 * Call a callback repeatedly until it completes without error
 * @param callback - the callback to try
 * @param maxTries - the maximum number of tries
 * @returns 
 */
Promise.callWithRetry = async function callWithRetry(callback, maxTries = 4) {
	const callbackPromise = async () => callback() // promisify callback
	let lastError = new Error()
	for (let tryCount = 0; tryCount < maxTries; tryCount++) {
		try { return await callbackPromise()} 
		catch(err) { lastError = err }
	}
	throw lastError
}
