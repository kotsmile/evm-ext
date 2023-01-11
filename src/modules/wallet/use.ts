import type { Bytes } from 'ethers'
import type { EvmContext } from '@/core/type'

import { safeRead, unwrapState, wrapState, type ChainId, type Cast } from '@/utils'

import { useModule, useModuleSafe } from '@/core/utils'
import { Contracts, Events } from '@/modules'

import { logger } from './utils'
import { useWalletState } from './state'

import type { UpdateParams } from './wallets/base'
import type { WalletParams } from './type'

export const useWallet_ctx = <WP extends WalletParams>(ctx: EvmContext, params: WP) => {
  return {
    async updateStoreState({ wallet, chainId, signer, login = true }: UpdateParams) {
      if (!wallet || !chainId) return

      const walletState = useWalletState(ctx)

      walletState.signer = wrapState(signer)
      walletState.wallet = wallet
      walletState.realChainId = chainId as ChainId
      walletState.login = login
    },
    async connect(
      walletType: Cast<keyof WP['wallets'] | null, string>,
      chainId?: ChainId
    ) {
      const { wallets } = params
      if (!wallets) return logger.warn('No wallets provided')
      if (!walletType) return

      logger.info(`Connect to "${walletType}"`)

      const walletState = useWalletState(ctx)
      const whClass = unwrapState(walletState.walletHandler)
      if (whClass) whClass?.clear()

      const contracts = useModule(ctx, Contracts)
      const events = useModuleSafe(ctx, Events)

      const walletHandler = new wallets[walletType](
        ctx,
        params,
        (contracts?.getContractsParams().chainIds as ChainId[]) ?? [],
        walletState.chainId,
        this.updateStoreState,
        (wallet) => {
          events?.useEvents().emit('onWalletChange', { wallet })
          if (params.options?.updateOnWalletChange) this.loadAll({ login: true })
        },
        (chainId) => {
          events?.useEvents().emit('onChainChange', { chainId, natural: true })
          if (params.options?.updateOnChainChange)
            this.loadAll({ init: true, login: true })
        }
      )

      walletState.walletType = walletType
      if (!(await walletHandler?.connect())) return

      walletState.chainId = chainId ?? walletState.chainId

      await this.loadAll({ init: true, login: true })
    },
    async loadAll({ init = true, login = true }: { init?: boolean; login?: boolean }) {
      const events = useModuleSafe(ctx, Events)
      if (!events) return

      const eventsActions = events.useEvents()

      if (init) await eventsActions.emit('init', {})
      if (login) await eventsActions.emit('login', {})

      await eventsActions.emit('final', {})
    },
    async signMessage(data: string | Bytes): Promise<string | null> {
      const walletState = useWalletState(ctx)

      if (walletState.login) {
        const signedMessage = await safeRead<string | null>(
          unwrapState(walletState.signer)!.signMessage(data),
          null
        )
        return signedMessage
      }
      return null
    },
    async switchChain(chainId: ChainId): Promise<boolean> {
      const events = useModuleSafe(ctx, Events)
      const eventsActions = events?.useEvents()

      const walletState = useWalletState(ctx)

      const result = Boolean(
        await unwrapState(walletState.walletHandler)?.switchChain(chainId)
      )
      if (result) eventsActions?.emit('onChainChange', { chainId, natural: false })
      return result
    },
    async disconnect(): Promise<boolean> {
      const events = useModuleSafe(ctx, Events)
      const eventsActions = events?.useEvents()

      // const { _emit } = useEvents(ctx)
      const walletState = useWalletState(ctx)

      await eventsActions?._emit('beforeLogout', {})
      walletState.login = false
      walletState.wallet = ''
      await eventsActions?._emit('logout', {})

      // setPreservedConnection(this.walletType, false)

      await eventsActions?._emit('afterLogout', {})
      return Boolean(await unwrapState(walletState.walletHandler)?.disconnect())
    },
  }
}
