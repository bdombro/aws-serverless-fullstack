/**
 * Polyfills for object
 */

// @ts-ignore: pick overload mismatch
export function pick<T extends Record<string, any>, K extends (keyof T)> (obj: T, keys: readonly K[]): Pick<T, K>
export function pick<T extends Record<string, any>, K extends (keyof T)> (obj: T, keys: K[]): Pick<T, K> {
  const res: Partial<Pick<T, K>> = {}
  keys?.forEach(k => {
    if (k in obj) res[k] = obj[k]
  })
  return res as Pick<T, K>
}

// @ts-ignore: omit overload mismatch
export function omit<T extends Record<string, any>, K extends (keyof T)> (obj: T, keys: readonly K[]): Omit<T, K>
export function omit<T extends Record<string, any>, K extends (keyof T)> (obj: T, keys: K[]): Omit<T, K> {
  const res = Object.assign({}, obj)
  keys?.forEach(k => {
    if (k in obj) delete res[k]
  })
  return res
}

const has = Object.prototype.hasOwnProperty

/**
 * Copied from npm/depqual
 */
export function equals(foo: any, bar: any): boolean {
  let ctor, len, tmp
  if (foo === bar) return true

  if (foo && bar && (ctor=foo.constructor) === bar.constructor) {
    if (ctor === Date) return foo.getTime() === bar.getTime()
    if (ctor === RegExp) return foo.toString() === bar.toString()

    if (ctor === Array) {
      if ((len=foo.length) === bar.length) {
        while (len-- && equals(foo[len], bar[len]));
      }
      return len === -1
    }

    if (ctor === Set) {
      if (foo.size !== bar.size) {
        return false
      }
      for (len of foo) {
        tmp = len
        if (tmp && typeof tmp === 'object') {
          tmp = find(bar, tmp)
          if (!tmp) return false
        }
        if (!bar.has(tmp)) return false
      }
      return true
    }

    if (ctor === Map) {
      if (foo.size !== bar.size) {
        return false
      }
      for (len of foo) {
        tmp = len[0]
        if (tmp && typeof tmp === 'object') {
          tmp = find(bar, tmp)
          if (!tmp) return false
        }
        if (!equals(len[1], bar.get(tmp))) {
          return false
        }
      }
      return true
    }

    if (ctor === ArrayBuffer) {
      foo = new Uint8Array(foo)
      bar = new Uint8Array(bar)
    } else if (ctor === DataView) {
      if ((len=foo.byteLength) === bar.byteLength) {
        while (len-- && foo.getInt8(len) === bar.getInt8(len));
      }
      return len === -1
    }

    if (ArrayBuffer.isView(foo)) {
      if ((len=foo.byteLength) === bar.byteLength) {
        while (len-- && (foo as any)[len] === bar[len]);
      }
      return len === -1
    }

    if (!ctor || typeof foo === 'object') {
      len = 0
      for (ctor in foo) {
        if (has.call(foo, ctor) && ++len && !has.call(bar, ctor)) return false
        if (!(ctor in bar) || !equals(foo[ctor], bar[ctor])) return false
      }
      return Object.keys(bar).length === len
    }
  }

  return foo !== foo && bar !== bar

  function find(iter: any, tar: any, key?: any) {
    for (key of iter.keys()) {
      if (equals(key, tar)) return key
    }
  }
}
