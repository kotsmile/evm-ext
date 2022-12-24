import modules from '@/modules'
import type {
  ContractsJSONStruct,
  ContractsDefinition,
  AppChainIds,
} from '@/modules/contracts/type'
import type { StoresDefinition } from '@/modules/store/type'
import type { WalletsDefintion } from '@/modules/wallet/type'

import type { EvmConfig, Module } from '@/config/type'
import { logger } from '@/config/utils'

import { keyOf } from '@/utils'

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
      logger.info('Init modules')

      const defered: Record<string, Module> = {}
      const modules_: Record<string, Module> = modules

      // not defered modules
      for (const name of keyOf(modules_)) {
        const module = modules_[name]
        if (module.defer) continue
        await module.init?.(config, modules).then((r) => {
          if (!r) logger.error(`Cant init ${name} module`)
        })
      }
      // defered modules
      for (const name of keyOf(modules_)) {
        const module = modules_[name]
        if (!module.defer) continue
        await module.init?.(config, modules).then((r) => {
          if (!r) logger.error(`Cant init ${name} module`)
        })
      }
    },
    config,
    ...modules.contracts.tools(config),
    ...modules.events.tools(config),
    ...modules.chain.tools(config),
    ...modules.state.tools(config),
    // ...modules.store.tools(config),
    ...modules.wallet.tools(config),
  })
}
