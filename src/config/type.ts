import type {
  ContractsJSONStruct,
  ContractsDefinition,
  AppChainIds,
} from '@/modules/contracts/type'
import type { StoresDefinition } from '@/modules/store/type'
import type { RpcDefinition } from '@/modules/chain/type'
import type { Options, WalletsDefintion } from '@/modules/wallet'

import type { Adapter } from '@/adapter'
import type { ChainId } from '@/utils/chain'

export type EvmConfig<
  ContractsJSON extends ContractsJSONStruct = ContractsJSONStruct,
  ChainIds extends AppChainIds<ContractsJSON> = any,
  DefaultChainId extends ChainIds[number] = any,
  Contracts extends ContractsDefinition<ContractsJSON, ChainIds[number]> = any,
  Stores extends StoresDefinition = StoresDefinition,
  Wallets extends WalletsDefintion = WalletsDefintion
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
export type ToolsFunction = (config: EvmConfig) => any

export type StateFunction<
  N extends string = string,
  S extends Record<N, Record<string, any>> = any
> = (config: EvmConfig) => S[N]

export type Module = {
  tools?: ToolsFunction
  init?: InitFunction
  defer?: boolean
  state?: StateFunction
}
