/**
 * Will return an array containing what's in the first array but NOT in the other arrays.
 * adapted from https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_difference
 */
export const difference: ArrayDifferenceType = (...arrays: any[][]) => {
	return arrays.reduce((a, b) => a.filter((c) => !b.includes(c)))
}

// Returns the same type as args
export type ArrayDifferenceType = <T extends any>(...arrays: T[][]) => T[];


/**
 * Return an intersection array of two or multiple arrays
 *
 * Example: arrayIntersection([1,2], [1]) => [1]
 */
// @ts-ignore any props
export function intersection(...arrays) {
	return arrays.reduce((a, b) => b.filter(Set.prototype.has.bind(new Set(a))))
}

export function keyBy(key: string, arr: Record<string, any>[]): any {
	return Object.fromEntries(arr.map(r => [r[key], r]))
}