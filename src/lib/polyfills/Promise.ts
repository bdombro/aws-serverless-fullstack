/**
 * Extensions for Promise
 */

export {}

declare global {
	interface PromiseConstructor {
		/**
		 * Return a promise that resolves after ms milliseconds
		 *
		 * Is basically the same as Rambdax's delay
		 *
		 * Can be used in async functions to wait for stuff.
		 *
		 * For example,
		 * while(checkIfTrue()) await sleep(200);
		 *
		 * @param ms: Number of milliseconds to wait
		 *
		 **/
		sleep(ms: number): Promise<undefined>
		/**
		 * Call a callback repeatedly until it completes without error
		 * @param callback - the callback to try
		 * @param maxTries - the maximum number of tries
		 * @returns - whatever the callback returns
		 */
		callWithRetry<T extends any>(callback: () => T, maxTries?: number): Promise<T>
	}
	// interface Promise<T> {
	// 	foo: 'bar'
	// }
}


Promise.sleep = async ms => 
	new Promise(resolve => setTimeout(resolve, ms))

Promise.callWithRetry = async function callWithRetry(callback, maxTries = 4) {
	const callbackPromise = async () => callback() // promisify callback
	let lastError = new Error()
	for (let tryCount = 0; tryCount < maxTries; tryCount++) {
		try { return await callbackPromise()} 
		catch(err) { lastError = err }
	}
	throw lastError
}
