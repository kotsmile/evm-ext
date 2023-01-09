import { Chain, type ChainParams } from './chain'
import {
  Contracts,
  type AppChainIds,
  type ContractsParams,
  type ContractsDefinition,
  type ContractsJSONStruct,
} from './contracts'
import { Events } from './events'
import { Store, type StoreParams } from './store'
import { Wallet, type WalletParams } from './wallet'

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
    ...Events(),
    ...Chain(config.chain),
    ...Contracts(config.contracts),
    ...Wallet(config.wallet),
    ...Store(config.store),
  } as const)

export { Chain, Contracts, Events, Store, Wallet }
