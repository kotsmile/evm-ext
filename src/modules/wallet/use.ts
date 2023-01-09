import type { Bytes } from 'ethers'
import type { EvmConfig } from '@/config/type'

import { safeRead, unwrapState, wrapState, type ChainId, type Cast } from '@/utils'

import { useModule } from '@/config/utils'
import { ContractsModule, EventsModule } from '@/modules'

import { logger } from './utils'
import { useWalletState } from './state'

import type { UpdateParams } from './wallets/base'
import type { WalletParams } from './type'

export const useWallet_config = <WP extends WalletParams>(
  config: EvmConfig,
  params: WP
) => {
  return {
    async updateStoreState({ wallet, chainId, signer, login = true }: UpdateParams) {
      if (!wallet || !chainId) return

      const walletState = useWalletState(config)

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

      const walletState = useWalletState(config)
      const whClass = unwrapState(walletState.walletHandler)
      if (whClass) whClass?.clear()

      const contracts = useModule(config, ContractsModule)
      const events = useModule(config, EventsModule)

      const walletHandler = new wallets[walletType](
        config,
        params,
        (contracts?.getContractsParams().chainIds as ChainId[]) ?? [],
        walletState.chainId,
        this.updateStoreState,
        (wallet) => {
          events.useEvents().emit('onWalletChange', { wallet })
          if (params.options?.updateOnWalletChange) this.loadAll({ login: true })
        },
        (chainId) => {
          events.useEvents().emit('onChainChange', { chainId, natural: true })
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
      const events = useModule(config, EventsModule)
      const eventsActions = events.useEvents()

      if (init) await eventsActions.emit('init', {})
      if (login) await eventsActions.emit('login', {})

      await eventsActions.emit('final', {})
    },
    async signMessage(data: string | Bytes): Promise<string | null> {
      const walletState = useWalletState(config)

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
      const events = useModule(config, EventsModule)
      const eventsActions = events.useEvents()

      const walletState = useWalletState(config)

      const result = Boolean(
        await unwrapState(walletState.walletHandler)?.switchChain(chainId)
      )
      if (result) eventsActions.emit('onChainChange', { chainId, natural: false })
      return result
    },
    async disconnect(): Promise<boolean> {
      const events = useModule(config, EventsModule)
      const eventsActions = events.useEvents()

      // const { _emit } = useEvents(config)
      const walletState = useWalletState(config)

      await eventsActions._emit('beforeLogout', {})
      walletState.login = false
      walletState.wallet = ''
      await eventsActions._emit('logout', {})

      // setPreservedConnection(this.walletType, false)

      await eventsActions._emit('afterLogout', {})
      return Boolean(await unwrapState(walletState.walletHandler)?.disconnect())
    },
  }
}
