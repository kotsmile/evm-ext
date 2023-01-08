import type { WalletModuleConfig, WalletsDefintion } from './type'

import { useWallet_config } from './use'
import { useWalletState } from './state'

import { logger } from './utils'
import type { Module } from '@/config/type'
import { useModule } from '@/config/utils'
import contractsModule from '@/modules/contracts'
import type { ChainId } from '@/utils/chain'

export const walletModule = <WC extends WalletModuleConfig>(walletConfig: WC) => ({
  wallet: {
    tools: (config) => ({
      useWallet: () => useWallet_config<WC>(config, walletConfig),
      useWalletState: () => useWalletState(config),
    }),
    init: async (config) => {
      try {
        const contracts = useModule(config, contractsModule)
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

export type {
  ChangeChainCallbackFunction,
  ChangeWalletCallbackFunction,
  ConnectFunction,
  UpdateStoreStateFunction,
  WalletHandler,
} from './wallets/base'

export type { WalletsDefintion, Options } from './type'
export type { WalletState } from './state'
