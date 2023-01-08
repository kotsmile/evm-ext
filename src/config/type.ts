import type { AdapterDefinition } from '@/adapter'

import type {
  AppChainIds,
  ContractsDefinition,
  ContractsJSONStruct,
} from '@/modules/contracts'

export type EvmConfig<Modules extends Record<string, Module> = Record<string, Module>> = {
  DEBUG?: boolean

  readonly adapter: AdapterDefinition
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
