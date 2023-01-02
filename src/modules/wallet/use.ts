import type { Bytes } from 'ethers'

import type { EvmConfig } from '@/config/type'

import { safeRead, unwrapState, wrapState } from '@/utils'
import type { ChainId } from '@/utils/chain'
import type { Cast } from '@/utils/type'

import { useState } from '@/modules/state'
import { useEvents } from '@/modules/events'
import type { ContractsJSONStruct } from '@/modules/contracts'
import type { StoresDefinition } from '@/modules/store'

import type { UpdateParams } from './wallets/base'
import { logger } from './utils'
import type { WalletsDefintion } from './type'

export const useWallet_config = <Wallets extends WalletsDefintion>(
  config: EvmConfig<ContractsJSONStruct, any, any, any, StoresDefinition, Wallets>
) => {
  const _this = useWallet_config(config)()
  return () => ({
    async updateStoreState({ wallet, chainId, signer, login = true }: UpdateParams) {
      if (!wallet || !chainId) return

      const { wallet: walletState } = useState(config)

      walletState.signer = wrapState(signer)
      walletState.wallet = wallet
      walletState.realChainId = chainId as ChainId
      walletState.login = login
    },
    async connect(walletType: Cast<keyof Wallets | null, string>, chainId?: ChainId) {
      const { wallets } = config
      if (!wallets) return logger.warn('No wallets provided')
      if (!walletType) return

      logger.info(`Connect to "${walletType}"`)

      const { wallet } = useState(config)
      const whClass = unwrapState(wallet.walletHandler)
      if (whClass) whClass?.clear()

      const walletHandler = new wallets[walletType](
        config,
        config.chainIds,
        wallet.chainId,
        _this.updateStoreState,
        (wallet) => {
          useEvents(config).emit('onWalletChange', { wallet })
          if (config.options?.updateOnWalletChange) _this.loadAll({ login: true })
        },
        (chainId) => {
          useEvents(config).emit('onChainChange', { chainId, natural: true })
          if (config.options?.updateOnChainChange)
            _this.loadAll({ init: true, login: true })
        }
      )

      wallet.walletType = walletType
      if (!(await walletHandler?.connect())) return

      wallet.chainId = chainId ?? wallet.chainId

      await _this.loadAll({ init: true, login: true })
    },
    async loadAll({ init = true, login = true }: { init?: boolean; login?: boolean }) {
      const { emit } = useEvents(config)

      if (init) await emit('init', {})
      if (login) await emit('login', {})

      await emit('final', {})
    },
    async signMessage(data: string | Bytes): Promise<string | null> {
      const { wallet } = useState(config)

      if (wallet.login) {
        const signedMessage = await safeRead<string | null>(
          unwrapState(wallet.signer)!.signMessage(data),
          null
        )
        return signedMessage
      }
      return null
    },
    async switchChain(chainId: ChainId): Promise<boolean> {
      const { emit } = useEvents(config)
      const { wallet } = useState(config)

      const result = Boolean(
        await unwrapState(wallet.walletHandler)?.switchChain(chainId)
      )
      if (result) emit('onChainChange', { chainId, natural: false })
      return result
    },
    async disconnect(): Promise<boolean> {
      const { _emit } = useEvents(config)
      const { wallet } = useState(config)

      await _emit('beforeLogout', {})
      wallet.login = false
      wallet.wallet = ''
      await _emit('logout', {})

      // setPreservedConnection(this.walletType, false)

      await _emit('afterLogout', {})
      return Boolean(await unwrapState(wallet.walletHandler)?.disconnect())
    },
  })
}
