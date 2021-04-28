/**
 * Extensions for Array
 */

export {}

declare global {
	interface ArrayConstructor {
		/**
		 * Will return an array containing what's in the first array but NOT in the other arrays.
		 * adapted from https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_difference
		 */
		difference: ArrayDifferenceType
		/**
		 * Return an intersection array of two or multiple arrays
		 *
		 * Example: arrayIntersection([1,2], [1]) => [1]
		 */
		intersection: ArrayDifferenceType
	}
	interface Array<T> {
		keyBy(key: string): Record<string, T>
		subtract(otherArr: T): T
	}
}

// Returns the same type as args
type ArrayDifferenceType = <T extends any>(...arrays: T[][]) => T[];

Array.difference = function(...arrays) {
	return arrays.reduce((a, b) => a.filter((c) => !b.includes(c)))
}

Array.intersection = function (...arrays) {
	return arrays.reduce((a, b) => b.filter(Set.prototype.has.bind(new Set(a))))
}

Array.prototype.keyBy = function(key) {
	return Object.fromEntries(this.map(r => [r[key], r]))
}

Array.prototype.subtract = function(arr) {
	return Array.difference(this, arr)
}