import type {
  ContractsJSONStruct,
  ContractsDefinition,
  AppChainIds,
} from '../modules/contracts/type'
import type { StoresDefinition } from '../modules/store/type'
import type { RpcDefinition } from '../modules/chain/type'
import type { Adapter } from '../adapter'
import type { Options, WalletsDefintion } from '../modules/wallet'

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

export type InitFunction = (config: EvmConfig) => Promise<boolean>
export type ToolsFunction = (config: EvmConfig) => any

export type Module = {
  tools?: ToolsFunction
  init?: InitFunction
  defer?: boolean
}
