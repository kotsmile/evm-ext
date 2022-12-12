import type { EvmConfig } from '../config/type'

export * as rpc from './chain/rpc'
export * as chain from './chain'
export type { INotNullSigner, ISigner } from './chain/type'
export { safe, safeRead, safeWrite } from './safe'

export const keyOf = <O extends Record<string | number | symbol, any>>(o: O) => {
  return Object.keys(o) as (keyof O)[]
}

export const entries = <O extends Record<string | number | symbol, any>>(o: O) => {
  return Object.entries<O[keyof O]>(o)
}

export const capitalize = <T extends string>(a: T): Capitalize<T> => {
  return (a[0].toUpperCase() + a.slice(1)) as Capitalize<T>
}

export const concat = <A extends string, B extends string>(a: A, b: B) =>
  `${a}${b}` as `${A}${B}`

export const wrap =
  <T>(v: T): (() => T) =>
  () =>
    v

export const unwrap = <T extends () => any>(f: T): ReturnType<T> => f()

export type Wrap<T> = ReturnType<typeof wrap<T>>
export type Unwrap<T extends () => any> = ReturnType<typeof unwrap<T>>

function invertColor(hex: string) {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1)
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.')
  }
  // invert color components
  var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
    g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
    b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16)
  // pad each with zeros and return
  return '#' + padZero(r) + padZero(g) + padZero(b)
}

function padZero(str: string, len = 2) {
  var zeros = new Array(len).join('0')
  return (zeros + str).slice(-len)
}

export const generateLog = (label: string, colorHex: string) => {
  const log = (message: any, config?: EvmConfig) => {
    if (!config?.DEBUG) return
    console.log(
      `%c${label} ${message}`,
      `
      color: ${invertColor(colorHex)}; 
      background: ${colorHex}; 
      font-weight: bold;
    `
    )
  }
  const warn = (message: any, config?: EvmConfig) => {
    if (!config?.DEBUG) return
    console.warn(`${label} ${message}`)
  }
  const error = (message: any, config?: EvmConfig) => {
    if (!config?.DEBUG) return
    console.error(`${label} ${message}`)
  }
  return { log, warn, error }
}

export const defaultValue = <T>(v: T | undefined, value: T): T => v ?? value
