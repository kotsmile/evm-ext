import { defineModule } from '@/config/utils'

import type { WalletModuleConfig, WalletsDefintion } from './type'

import { useWallet_config } from './use'
import { useWalletState } from './state'

import { logger } from './utils'

export const walletModule = defineModule({
  name: 'wallet',
  setup<WC extends WalletsDefintion>(walletConfig: WalletModuleConfig<WC>) {
    return {
      tools: (config) => ({
        useWallet: () => useWallet_config<WalletModuleConfig<WC>>(config, walletConfig),
        useWalletState: () => useWalletState(config),
      }),
      init: async (config) => {
        try {
          const wallet = useWalletState(config)
          wallet.chainId = wallet.DEFAULT_CHAINID = config.DEFAULT_CHAINID
          wallet.chainIds = config.chainIds
        } catch (e) {
          logger.error(e)
          return false
        }
        logger.info('Initiated')
        return true
      },
    }
  },
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
