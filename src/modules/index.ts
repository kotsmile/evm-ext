import { ChainModule, type ChainParams } from './chain'
import {
  ContractsModule,
  type AppChainIds,
  type ContractsParams,
  type ContractsDefinition,
  type ContractsJSONStruct,
} from './contracts'
import { EventsModule } from './events'
import { StoreModule, type StoreParams } from './store'
import { WalletModule, type WalletParams } from './wallet'

export const defaultModules = <
  ContractsJSON extends ContractsJSONStruct,
  ChainIds extends AppChainIds<ContractsJSON>,
  DefaultChainId extends ChainIds[number],
  Contracts extends ContractsDefinition<ContractsJSON, ChainIds[number]>,
  WP extends WalletParams
>(config: {
  chain: ChainParams
  contracts: ContractsParams<ContractsJSON, ChainIds, DefaultChainId, Contracts>
  store: StoreParams
  wallet: WP
}) =>
  ({
    ...EventsModule(),
    ...ChainModule(config.chain),
    ...ContractsModule(config.contracts),
    ...WalletModule(config.wallet),
    ...StoreModule(config.store),
  } as const)

export { ChainModule, ContractsModule, EventsModule, StoreModule, WalletModule }
