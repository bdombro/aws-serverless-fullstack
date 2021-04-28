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
	const raw = Object.values(enumFrom)
	return raw.slice(raw.length/2)
}

function getEnumFromClassInstance<T>(classInstance: T) {
	return Object.fromEntries(Object.keys(classInstance).map(k => [k,k])) as Record<keyof T, keyof T>
}
