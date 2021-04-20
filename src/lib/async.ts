/**
 * Polyfills for async related tasks
 */

/**
 * Call a callback repeatedly until it completes without error
 * @param callback - the callback to try
 * @param maxTries - the maximum number of tries
 * @returns 
 */
export async function callWithRetry<T extends any>(callback: () => T, maxTries = 4): Promise<T> {
	const callbackPromise = async () => callback() // promisify callback
	let lastError = new Error()
	for (let tryCount = 0; tryCount < maxTries; tryCount++) {
		try { return await callbackPromise()} 
		catch(err) { lastError = err }
	}
	throw lastError
}
