import type { AdapterDefinition } from '@/adapter'

import type {
  AppChainIds,
  ContractsDefinition,
  ContractsJSONStruct,
} from '@/modules/contracts'

export type EvmConfig<
  Modules extends Record<string, Module> = Record<string, Module>,
  ContractsJSON extends ContractsJSONStruct = ContractsJSONStruct,
  ChainIds extends AppChainIds<ContractsJSON> = any,
  DefaultChainId extends ChainIds[number] = any,
  Contracts extends ContractsDefinition<ContractsJSON, ChainIds[number]> = any
> = {
  DEBUG?: boolean
  /// deployed contracts
  readonly contractsJSON?: ContractsJSON
  /// dapp support chainids
  readonly chainIds?: ChainIds
  readonly DEFAULT_CHAINID?: DefaultChainId
  /// contracts
  readonly contracts?: Contracts
  /// stores
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
