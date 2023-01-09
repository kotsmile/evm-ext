import type { WalletParams } from './type'

import type { ChainId } from '@/utils/chain'

import { useWallet_config } from './use'
import { useWalletState } from './state'
import { logger } from './utils'

import type { Module } from '@/config/type'

import { useModule } from '@/config/utils'
import { ContractsModule } from '@/modules'

export const WalletModule = <WP extends WalletParams>(params: WP) => ({
  wallet: {
    tools: (config) => ({
      useWallet: () => useWallet_config<WP>(config, params),
      useWalletState: () => useWalletState(config),
      getWalletConfig: () => params,
    }),
    init: async (config) => {
      try {
        const contracts = useModule(config, ContractsModule)
        if (!contracts) return false

        const wallet = useWalletState(config)

        wallet.chainId = wallet.DEFAULT_CHAINID = contracts.getContractsParams()
          .DEFAULT_CHAINID as ChainId
        wallet.chainIds = contracts.getContractsParams().chainIds as ChainId[]
      } catch (e) {
        logger.error(e)
        return false
      }
      logger.info('Initiated')
      return true
    },
  } satisfies Module,
})

export * from './wallets/base'
export * from './wallets/utils'

export * from './type'
export * from './state'
export * from './use'
