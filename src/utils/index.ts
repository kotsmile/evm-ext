export * from './chain/rpc'
export * from './chain'
export * from './chain/type'
export * from './safe'
export * from './address'
export * from './type'
export * from './error'

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

export const wrapState =
  <T>(v: T): (() => T) =>
  () =>
    v

export const unwrapState = <T extends () => any>(f: T): ReturnType<T> => f()

export type WrapState<T> = ReturnType<typeof wrapState<T>>
export type UnwrapState<T extends () => any> = ReturnType<typeof unwrapState<T>>

export type LogType = 'info' | 'warn' | 'error'
export type LogFunction = (msg: string) => any

let isLoggerEnabled = true

export const disableLogger = () => (isLoggerEnabled = false)
export const enableLogger = () => (isLoggerEnabled = true)

export const createLogger = (label: string) => {
  const info = (infoMsg: any) =>
    isLoggerEnabled &&
    console.log(
      `%c[${label}] ${infoMsg}`,
      `
      color: #111111; 
      background: #AAAAAA; 
      font-weight: bold;
    `
    )
  const warn = (warnMsg: any) => isLoggerEnabled && console.warn(`[${label}] ${warnMsg}`)
  const error = (errorMsg: any) =>
    isLoggerEnabled && console.error(`[${label}]`, errorMsg)

  return { info, warn, error }
}

export const defaultValue = <T>(v: T | undefined, value: T): T => v ?? value
export const typeOf = <T>(): T => ({} as T)
