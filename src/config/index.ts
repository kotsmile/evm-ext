import type {
  ContractsJSONStruct,
  ContractsDefinition,
  AppChainIds,
} from '../modules/contracts/type'
import type { StoresDefinition } from '../modules/store/type'
import type { WalletsDefintion } from '../modules/wallet/type'
import type { EvmConfig } from './type'

import { info } from './utils'

// import contracts_module, { init as initContracts } from '../modules/contracts'
// import events_module, { init as initEvents } from '../modules/events'
// import chain_module, { init as initChain } from '../modules/chain'
// import store_module, { init as initStore } from '../modules/store'
// import wallet_module, { init as initWallet, WalletsDefintion } from '../modules/wallet'

export const defineEvmConfig = <
  ContractsJSON extends ContractsJSONStruct,
  ChainIds extends AppChainIds<ContractsJSON>,
  DefaultChainId extends ChainIds[number],
  Contracts extends ContractsDefinition<ContractsJSON, ChainIds[number]>,
  Stores extends StoresDefinition,
  Wallets extends WalletsDefintion
>(
  config: EvmConfig<ContractsJSON, ChainIds, DefaultChainId, Contracts, Stores, Wallets>
) => {
  return () => ({
    init: async () => {
      // log('Init modules', config)
      // await initContracts(config)
      // await initChain(config)
      // await initWallet(config)
      // await initEvents(config)
      // await initStore(config)
    },
    config,
    // ...contracts_module(config),
    // ...events_module(config),
    // ...chain_module(config),
    // ...store_module(config),
    // ...wallet_module(config),
  })
}
