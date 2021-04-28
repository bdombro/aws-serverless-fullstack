/**
 * Extensions for Function
 */

import type Memoize from './Function.memoize'
const memoize = require('./Function.memoize')

export {}

declare global {
	interface FunctionConstructor {
		/**
		 * Memoize a function - adapted from https://github.com/caiogondim/fast-memoize.js
		 * @param {*} fn - The function to be memoized
		 * @param {*} options - options to be passed in (see https://github.com/caiogondim/fast-memoize.js)
		 * @returns - the fn wrapped in memoize logic
		 */
		memoize: typeof Memoize
	}
}

Function.memoize = memoize
