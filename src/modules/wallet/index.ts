import type { WalletParams } from './type'

import type { ChainId } from '@/utils/chain'

import { useWallet_ctx } from './use'
import { useWalletState } from './state'
import { logger } from './utils'

import type { Module } from '@/core/type'

import { useModule } from '@/core/utils'
import { Contracts } from '@/modules'

export const Wallet = <WP extends WalletParams>(params: WP) => ({
  wallet: {
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
  } satisfies Module,
})

export * from './wallets/base'
export * from './wallets/utils'

export * from './type'
export * from './state'
export * from './use'
