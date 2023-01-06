import type { AdapterDefinition } from '@/adapter'

export type EvmConfig<Modules extends Record<string, Module> = {}> = {
  DEBUG?: boolean
  adapter: AdapterDefinition
  readonly modules: Modules
}

export type InitFunction = (config: EvmConfig) => Promise<boolean>

export type ToolsFunction<
  M extends Record<string, Module> = {},
  R extends Record<string, any> = Record<string, any>
> = (config: EvmConfig<M>) => R

export type StateFunction<S extends Record<string, any> = any> = (config: EvmConfig) => S

export type Module = {
  tools?: ToolsFunction
  init?: InitFunction
  defer?: boolean
}
