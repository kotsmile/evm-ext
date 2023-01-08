import type { WalletModuleConfig } from './type'

import type { ChainId } from '@/utils/chain'

import { useWallet_config } from './use'
import { useWalletState } from './state'
import { logger } from './utils'

import type { Module } from '@/config/type'

import { useModule } from '@/config/utils'
import { ContractsModule } from '@/modules'

export const walletModule = <WC extends WalletModuleConfig>(walletConfig: WC) => ({
  wallet: {
    tools: (config) => ({
      useWallet: () => useWallet_config<WC>(config, walletConfig),
      useWalletState: () => useWalletState(config),
      getWalletConfig: () => walletConfig,
    }),
    init: async (config) => {
      try {
        const contracts = useModule(config, ContractsModule)
        if (!contracts) return false

        const wallet = useWalletState(config)

        wallet.chainId = wallet.DEFAULT_CHAINID = contracts.getContractsConfig()
          .DEFAULT_CHAINID as ChainId
        wallet.chainIds = contracts.getContractsConfig().chainIds as ChainId[]
      } catch (e) {
        logger.error(e)
        return false
      }
      logger.info('Initiated')
      return true
    },
  } satisfies Module,
})

export default walletModule

export * from './wallets/base'
export * from './wallets/utils'

export * from './type'
export * from './state'
export * from './use'
