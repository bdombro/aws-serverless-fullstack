export {}

declare global {
	// eslint-disable-next-line no-var
	var Enum: {
		/**
		 * Gets enum values from enum
		 * 
		 * Object.values(enum) returns Keys and Values for some reason, so this corrects that.
		 * 
		 * @param enum0 Incoming enum
		 */
		getEnumValues: any
		/**
		 * Creates an enum-like object from a class instance
		 */
		getEnumFromClassInstance: any
	}
}


globalThis.Enum = {
	getEnumValues,
	getEnumFromClassInstance,
}

function getEnumValues(enumFrom: Record<string, any>) {
	const vals = Object.entries(enumFrom)
		// If enum values are number type, entries() will emit it also
		// as a key, which we don't want so filter them out.
		.filter(([key]) => isNaN(Number(key)))
		.map(([_,val]) => val)
	return vals
}

function getEnumFromClassInstance<T>(classInstance: T) {
	return Object.fromEntries(Object.keys(classInstance).map(k => [k,k])) as Record<keyof T, keyof T>
}
