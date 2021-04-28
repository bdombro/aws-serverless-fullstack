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

declare const memoize: Memoize

export default memoize