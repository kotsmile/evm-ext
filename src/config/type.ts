import type { AdapterDefinition } from '@/adapter'

export type EvmConfig<
  Modules extends Record<string, Module> = Record<string, Module>,
  Adapter extends AdapterDefinition = AdapterDefinition
> = {
  DEBUG?: boolean
  readonly adapter: Adapter
  readonly modules?: Modules
}

export type InitFunction = (config: EvmConfig) => Promise<boolean>
export type ToolsFunction = (config: EvmConfig) => Record<string, any>

export type StateFunction<S extends Record<string, any> = any> = (config: EvmConfig) => S

export type Module = {
  tools?: ToolsFunction
  init?: InitFunction
  defer?: boolean
}
export type ModuleDefinition = Record<string, Module>
