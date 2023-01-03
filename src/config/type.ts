import type {
  ContractsJSONStruct,
  ContractsDefinition,
  AppChainIds,
} from '@/modules/contracts/type'
import type { StoresDefinition } from '@/modules/store/type'
import type { RpcDefinition } from '@/modules/chain/type'
import type { Options, WalletsDefintion } from '@/modules/wallet'

import type { AdapterDefinition } from '@/adapter'

export type EvmConfig<
  ContractsJSON extends ContractsJSONStruct = ContractsJSONStruct,
  ChainIds extends AppChainIds<ContractsJSON> = any,
  DefaultChainId extends ChainIds[number] = any,
  Contracts extends ContractsDefinition<ContractsJSON, ChainIds[number]> = any,
  Stores extends StoresDefinition = StoresDefinition,
  Wallets extends WalletsDefintion = WalletsDefintion,
  Adapter extends AdapterDefinition = AdapterDefinition
> = {
  /// deployed contracts
  readonly contractsJSON?: ContractsJSON
  /// dapp support chainids
  readonly chainIds?: ChainIds
  readonly DEFAULT_CHAINID?: DefaultChainId
  rpc?: RpcDefinition
  /// contracts
  readonly contracts?: Contracts
  /// stores
  readonly stores?: Stores
  readonly wallets?: Wallets

  adapter: Adapter
  options?: Options
  DEBUG?: boolean
}

export type InitFunction = (
  config: EvmConfig,
  modules: Record<string, Module>
) => Promise<boolean>
export type ToolsFunction<R = any> = (config: EvmConfig) => R

export type StateFunction<S extends Record<string, any> = any> = (config: EvmConfig) => S

export type Module = {
  tools?: ToolsFunction
  init?: InitFunction
  defer?: boolean
}
