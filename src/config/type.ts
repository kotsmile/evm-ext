import type { AdapterDefinition } from '@/adapter'

import type {
  AppChainIds,
  ContractsDefinition,
  ContractsJSONStruct,
} from '@/modules/contracts'

export type EvmConfig<
  Modules extends Record<string, Module<any, any>> = Record<string, Module<any, any>>,
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
  readonly adapter: AdapterDefinition
  readonly modules: Modules
}

export type InitFunction = (config: EvmConfig) => Promise<boolean>
export type ToolsFunction = (config: EvmConfig) => Record<string, any>

export type StateFunction<S extends Record<string, any> = any> = (config: EvmConfig) => S

export type Module<
  Config extends any = {},
  TF extends ToolsFunction | undefined = undefined
> = {
  config: Config
  readonly tools?: TF
  init?: InitFunction
  defer?: boolean
}

export type ModuleDefinition<
  Name extends string,
  Config extends any = {},
  TF extends ToolsFunction | undefined = undefined
> = {
  name: Name
  setup: (config: Config) => Omit<Module<Config, TF>, 'config'>
}
