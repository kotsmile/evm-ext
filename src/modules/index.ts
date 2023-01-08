import ChainModule from './chain'
import ContractsModule, {
  type AppChainIds,
  type ContractsConfig,
  type ContractsDefinition,
  type ContractsJSONStruct,
} from './contracts'
import EventsModule from './events'
import StoreModule from './store'
import WalletModule, { type WalletModuleConfig } from './wallet'

export const defaultModules = <
  ContractsJSON extends ContractsJSONStruct,
  ChainIds extends AppChainIds<ContractsJSON>,
  DefaultChainId extends ChainIds[number],
  Contracts extends ContractsDefinition<ContractsJSON, ChainIds[number]>,
  ChainConfig extends Parameters<typeof ChainModule>[0],
  WalletConfig extends WalletModuleConfig,
  StoreConfig extends Parameters<typeof StoreModule>[0]
>(config: {
  chain: ChainConfig
  contracts: ContractsConfig<ContractsJSON, ChainIds, DefaultChainId, Contracts>
  store: StoreConfig
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
