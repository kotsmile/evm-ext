import ChainModule, { type ChainModuleConfig } from './chain'
import ContractsModule, {
  type AppChainIds,
  type ContractsConfig,
  type ContractsDefinition,
  type ContractsJSONStruct,
} from './contracts'
import EventsModule from './events'
import StoreModule, { type StoreModuleConfig } from './store'
import WalletModule, { type WalletModuleConfig } from './wallet'

export const defaultModules = <
  ContractsJSON extends ContractsJSONStruct,
  ChainIds extends AppChainIds<ContractsJSON>,
  DefaultChainId extends ChainIds[number],
  Contracts extends ContractsDefinition<ContractsJSON, ChainIds[number]>,
  WalletConfig extends WalletModuleConfig
>(config: {
  chain: ChainModuleConfig
  contracts: ContractsConfig<ContractsJSON, ChainIds, DefaultChainId, Contracts>
  store: StoreModuleConfig
  wallet: WalletConfig
}) =>
  ({
    ...EventsModule(),
    ...ChainModule(config.chain),
    ...ContractsModule(config.contracts),
    ...WalletModule(config.wallet),
    ...StoreModule(config.store),
  } as const)

export { ChainModule, ContractsModule, EventsModule, StoreModule, WalletModule }
