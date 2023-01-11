import { Module, useModule } from '@/core'

import type { ChainId } from '@/utils/chain'

import type { WalletParams } from './type'

import { useWallet_ctx } from './use'
import { useWalletState } from './state'
import { logger } from './utils'

import { Contracts } from '@/modules'

export const Wallet = <WP extends WalletParams>(params: WP) =>
  Module(
    'wallet',
    {
      tools: (ctx) => ({
        useWallet: () => useWallet_ctx<WP>(ctx, params),
        useWalletState: () => useWalletState(ctx),
        getWalletConfig: () => params,
      }),
      init: async (ctx) => {
        try {
          const contracts = useModule(ctx, Contracts)
          if (!contracts) return false

          const wallet = useWalletState(ctx)

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
    },
    ['contracts']
  )

export * from './wallets/base'
export * from './wallets/utils'

export * from './type'
export * from './state'
export * from './use'
