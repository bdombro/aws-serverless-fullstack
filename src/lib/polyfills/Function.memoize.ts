/**
 * Memoize a function - adapted from https://github.com/caiogondim/fast-memoize.js
 * @param {*} fn - The function to be memoized
 * @param {*} options - options to be passed in (see https://github.com/caiogondim/fast-memoize.js)
 * @returns - the fn wrapped in memoize logic
 */
function memoize (fn: Func, options: Options<any>) {
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

function isPrimitive (value: any) {
	return value == null || typeof value === 'number' || typeof value === 'boolean' // || typeof value === "string" 'unsafe' primitive for our needs
}

function monadic (fn: any, cache: any, serializer: any, arg: any) {
	const cacheKey = isPrimitive(arg) ? arg : serializer(arg)

	let computedValue = cache.get(cacheKey)
	if (typeof computedValue === 'undefined') {
		// @ts-ignore: this in function
		computedValue = fn.call(this, arg)
		cache.set(cacheKey, computedValue)
	}
	return computedValue
}

function variadic (fn: any, cache: any, serializer: any) {
	// eslint-disable-next-line
	const args = Array.prototype.slice.call(arguments, 3)
	const cacheKey = serializer(args)

	let computedValue = cache.get(cacheKey)
	if (typeof computedValue === 'undefined') {
		// @ts-ignore: this in function
		computedValue = fn.apply(this, args)
		cache.set(cacheKey, computedValue)
	}
	return computedValue
}

function assemble (fn: any, context: any, strategy: any, cache: any, serialize: any) {
	const s = strategy.bind(
		context,
		fn,
		cache,
		serialize
	)
	s.bust = () => cache.bust()
	return s
}

function strategyDefault (fn: any, options: any) {
	const strategy = fn.length === 1 ? monadic : variadic

	return assemble(
		fn,
		// @ts-ignore: this in function
		this,
		strategy,
		options.cache.create(),
		options.serializer
	)
}

function strategyVariadic (fn: any, options: any) {
	const strategy = variadic

	return assemble(
		fn,
		// @ts-ignore: this in function
		this,
		strategy,
		options.cache.create(),
		options.serializer
	)
}

function strategyMonadic (fn: any, options: any) {
	const strategy = monadic

	return assemble(
		fn,
		// @ts-ignore: this in function
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
	// eslint-disable-next-line
	return JSON.stringify(arguments)
}

//
// Cache
//

function ObjectWithoutPrototypeCache () {
	// @ts-ignore: this in function
	this.cache = Object.create(null)
}

ObjectWithoutPrototypeCache.prototype.has = function (key: string) {
	return (key in this.cache)
}

ObjectWithoutPrototypeCache.prototype.get = function (key: string) {
	return this.cache[key]
}

ObjectWithoutPrototypeCache.prototype.set = function (key: string, value: any) {
	this.cache[key] = value
}

ObjectWithoutPrototypeCache.prototype.bust = function () {
	this.cache = Object.create(null)
}

const cacheDefault = {
	create: function create () {
		// @ts-ignore: function as class
		return new ObjectWithoutPrototypeCache()
	}
}


//
// API
//

export default Object.assign(memoize,
	{
		variadic: strategyVariadic,
		monadic: strategyMonadic
	},
) as unknown as Memoize



type Func = (...args: any[]) => any;

export interface Cache<K, V> {
  create: CacheCreateFunc<K, V>
}

interface CacheCreateFunc<K, V> {
  (): {
    get(key: K): V;
    set(key: K, value: V): void;
    has(key: K): boolean;
		bust(): void;
   }
}

export type Serializer = (args: any[]) => string;

export interface Options<F extends Func> {
  cache?: Cache<string, ReturnType<F>>;
  serializer?: Serializer;
  strategy?: MemoizeFunc;
}

export interface MemoizeFunc {
  <F extends Func>(fn: F, options?: Options<F>): F & {bust(): void};
}

/**
 * Memoize a function - adapted from https://github.com/caiogondim/fast-memoize.js
 * @param {*} fn - The function to be memoized
 * @param {*} options - options to be passed in (see https://github.com/caiogondim/fast-memoize.js)
 * @returns - the fn wrapped in memoize logic
 */
interface Memoize extends MemoizeFunc {
  strategies: {
    variadic: MemoizeFunc;
    monadic: MemoizeFunc;
  };
}
