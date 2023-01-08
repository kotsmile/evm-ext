import type { Bytes } from 'ethers'

import type { EvmConfig } from '@/config/type'

import { safeRead, unwrapState, wrapState } from '@/utils'
import type { ChainId } from '@/utils/chain'
import type { Cast } from '@/utils/type'

import { useEvents } from '@/modules/events'

import type { UpdateParams } from './wallets/base'
import { logger } from './utils'
import type { WalletModuleConfig, WalletsDefintion } from './type'
import { useWalletState } from './state'

export const useWallet_config = <WC extends WalletsDefintion>(
  config: EvmConfig,
  walletConfig: WalletModuleConfig<WC>
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
      walletType: Cast<keyof WC['wallets'] | null, string>,
      chainId?: ChainId
    ) {
      const { wallets } = walletConfig
      if (!wallets) return logger.warn('No wallets provided')
      if (!walletType) return

      logger.info(`Connect to "${walletType}"`)

      const walletState = useWalletState(config)
      const whClass = unwrapState(walletState.walletHandler)
      if (whClass) whClass?.clear()

      const walletHandler = new wallets[walletType](
        config,
        walletConfig,
        config.chainIds,
        walletState.chainId,
        this.updateStoreState,
        (wallet) => {
          useEvents(config).emit('onWalletChange', { wallet })
          if (walletConfig.options?.updateOnWalletChange) this.loadAll({ login: true })
        },
        (chainId) => {
          useEvents(config).emit('onChainChange', { chainId, natural: true })
          if (walletConfig.options?.updateOnChainChange)
            this.loadAll({ init: true, login: true })
        }
      )

      walletState.walletType = walletType
      if (!(await walletHandler?.connect())) return

      walletState.chainId = chainId ?? walletState.chainId

      await this.loadAll({ init: true, login: true })
    },
    async loadAll({ init = true, login = true }: { init?: boolean; login?: boolean }) {
      const { emit } = useEvents(config)

      if (init) await emit('init', {})
      if (login) await emit('login', {})

      await emit('final', {})
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
      const { emit } = useEvents(config)
      const walletState = useWalletState(config)

      const result = Boolean(
        await unwrapState(walletState.walletHandler)?.switchChain(chainId)
      )
      if (result) emit('onChainChange', { chainId, natural: false })
      return result
    },
    async disconnect(): Promise<boolean> {
      const { _emit } = useEvents(config)
      const walletState = useWalletState(config)

      await _emit('beforeLogout', {})
      walletState.login = false
      walletState.wallet = ''
      await _emit('logout', {})

      // setPreservedConnection(this.walletType, false)

      await _emit('afterLogout', {})
      return Boolean(await unwrapState(walletState.walletHandler)?.disconnect())
    },
  }
}
