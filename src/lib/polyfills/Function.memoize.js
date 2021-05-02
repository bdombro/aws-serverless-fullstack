/**
 * Memoize a function - adapted from https://github.com/caiogondim/fast-memoize.js
 * @param {*} fn - The function to be memoized
 * @param {*} options - options to be passed in (see https://github.com/caiogondim/fast-memoize.js)
 * @returns - the fn wrapped in memoize logic
 */
function memoize (fn, options) {
	const cache = options && options.cache
		? options.cache
		: cacheDefault

	const serializer = options && options.serializer
		? options.serializer
		: serializerDefault

	const strategy = options && options.strategy
		? options.strategy
		: strategyDefault

	return strategy(fn, {cache,serializer})
}

//
// Strategy
//

function isPrimitive (value) {
	return value == null || typeof value === 'number' || typeof value === 'boolean' // || typeof value === "string" 'unsafe' primitive for our needs
}

function monadic (fn, cache, serializer, arg) {
	const cacheKey = isPrimitive(arg) ? arg : serializer(arg)

	let computedValue = cache.get(cacheKey)
	if (typeof computedValue === 'undefined') {
		computedValue = fn.call(this, arg)
		cache.set(cacheKey, computedValue)
	}
	return computedValue
}

function variadic (fn, cache, serializer) {
	const args = Array.prototype.slice.call(arguments, 3)
	const cacheKey = serializer(args)

	let computedValue = cache.get(cacheKey)
	if (typeof computedValue === 'undefined') {
		computedValue = fn.apply(this, args)
		cache.set(cacheKey, computedValue)
	}
	return computedValue
}

function assemble (fn, context, strategy, cache, serialize) {
	const s = strategy.bind(
		context,
		fn,
		cache,
		serialize
	)
	s.bust = () => cache.bust()
	return s
}

function strategyDefault (fn, options) {
	const strategy = fn.length === 1 ? monadic : variadic

	return assemble(
		fn,
		this,
		strategy,
		options.cache.create(),
		options.serializer
	)
}

function strategyVariadic (fn, options) {
	const strategy = variadic

	return assemble(
		fn,
		this,
		strategy,
		options.cache.create(),
		options.serializer
	)
}

function strategyMonadic (fn, options) {
	const strategy = monadic

	return assemble(
		fn,
		this,
		strategy,
		options.cache.create(),
		options.serializer
	)
}

//
// Serializer
//

function serializerDefault () {
	return JSON.stringify(arguments)
}

//
// Cache
//

function ObjectWithoutPrototypeCache () {
	this.cache = Object.create(null)
}

ObjectWithoutPrototypeCache.prototype.has = function (key) {
	return (key in this.cache)
}

ObjectWithoutPrototypeCache.prototype.get = function (key) {
	return this.cache[key]
}

ObjectWithoutPrototypeCache.prototype.set = function (key, value) {
	this.cache[key] = value
}

ObjectWithoutPrototypeCache.prototype.bust = function () {
	this.cache = Object.create(null)
}

var cacheDefault = {
	create: function create () {
		return new ObjectWithoutPrototypeCache()
	}
}

//
// API
//

module.exports = memoize
module.exports.strategies = {
	variadic: strategyVariadic,
	monadic: strategyMonadic
}