export function getRandomId() {
  return Math.random().toString(36).slice(2);
}
export function getObjectKeys<T extends Record<string, any>>(obj: T) {
  return Object.keys(obj) as (keyof T)[];
}

export function toStringTag(value: any) {
  return Object.prototype.toString.call(value);
}

export function hasOwnProperty(target: Object, key: string) {
  return Object.prototype.hasOwnProperty.call(target, key);
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

export function isBigInt(value: unknown): value is bigint {
  return toStringTag(value) === '[object BigInt]';
}

export function isArray(value: unknown): value is unknown[] {
  return value instanceof Array;
}

export function isArrayLike(
  value: unknown,
): value is NodeList | HTMLCollection {
  return value instanceof NodeList || value instanceof HTMLCollection;
}

export function isObjectLike(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function isPlainObject(
  value: unknown,
): value is Record<string, unknown> {
  if (!isObjectLike(value) || toStringTag(value) !== '[object Object]') {
    return false;
  }
  return true;
}

export function isPrototype(value: unknown): value is Object {
  if (
    isObjectLike(value) &&
    hasOwnProperty(value, 'constructor') &&
    typeof value.constructor === 'function'
  ) {
    return true;
  }
  return false;
}

export function isBlob(value: unknown): value is Blob {
  return value instanceof Blob;
}

export function isArrayBuffer(value: unknown): value is ArrayBuffer {
  return value instanceof ArrayBuffer;
}

export function isURLSearchParams(value: unknown): value is URLSearchParams {
  return value instanceof URLSearchParams;
}

export function isFormData(value: unknown): value is FormData {
  return value instanceof FormData;
}

export function isFile(value: unknown): value is File {
  return value instanceof File;
}

export function isHeaders(value: unknown): value is Headers {
  return value instanceof Headers;
}

export function isDocument(value: unknown): value is Document {
  return value instanceof Document;
}

export function isURL(value: unknown): value is URL {
  return value instanceof URL;
}

type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;
export function isTypedArray(value: unknown): value is TypedArray {
  return ArrayBuffer.isView(value);
}

interface PrimitiveResult {
  ok: boolean;
  value: any;
}

const stringify = (value: any) => `${value}`;
const primitive = (value: any) => ({
  ok: true,
  value,
});

export function makePrimitiveValue(value: unknown): PrimitiveResult {
  if (value === undefined) {
    return primitive(stringify(value));
  }
  if (value === null) {
    return primitive(value);
  }
  if (isNumber(value)) {
    if (value === -Infinity || value === Infinity || Number.isNaN(value)) {
      return primitive(stringify(value));
    }
  }
  if (isBigInt(value)) {
    return primitive(`${value}n`);
  }
  if (typeof value === 'symbol' || typeof value === 'function') {
    return primitive(stringify(value.toString()));
  }
  if (value instanceof Error) {
    return primitive(stringify(value.stack!));
  }
  if (value === Object.prototype) {
    return {
      value: null,
      ok: false,
    };
  }
  if (!(value instanceof Object || typeof value === 'object')) {
    return primitive(value);
  }
  return {
    value,
    ok: false,
  };
}

/**
 * convert `symbol / error / undefined / function` type data to readable string content
 */
export function stringifyData(data: any): any {
  const { ok, value } = makePrimitiveValue(data);
  /* c8 ignore next 3 */
  if (ok) {
    return value;
  }
  return JSON.stringify(data, (key, val) => makePrimitiveValue(val).value, 2);
}

export function getValueType(value: any) {
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (isBigInt(value)) return 'bigint';
  if (value instanceof Object) {
    if (value instanceof Error) return 'error';
    if (value instanceof Function) return 'function';
    return 'object';
  }
  return typeof value;
}

/**
 * The methods are used for internal calls.
 */
interface PSLog {
  log(message: string): void;
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}
export const psLog = (['log', 'info', 'error', 'warn'] as const).reduce(
  (result, method) => {
    // eslint-disable-next-line no-param-reassign
    result[method] = (message: string) => {
      console[method](
        `[PageSpy] [${method.toLocaleUpperCase()}]: ${message.toString()}`,
      );
    };
    return result;
  },
  {} as PSLog,
);
