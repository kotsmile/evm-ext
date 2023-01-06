import type { AdapterDefinition } from '@/adapter'

export type EvmConfig<Modules extends Module[] = Module[]> = {
  DEBUG?: boolean
  adapter: AdapterDefinition
  modules: Modules
}

export type InitFunction = (
  config: EvmConfig,
  modules: Record<string, Module>
) => Promise<boolean>

export type ToolsFunction<
  M extends Module[] = Module[],
  R extends Record<string, any> = Record<string, any>
> = (config: EvmConfig<M>) => R

export type StateFunction<S extends Record<string, any> = any> = (config: EvmConfig) => S

export type Module = {
  name: string
  tools?: ToolsFunction
  init?: InitFunction
  defer?: boolean
}
