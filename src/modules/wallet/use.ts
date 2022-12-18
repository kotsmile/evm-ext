import type { Bytes } from 'ethers'

import type { EvmConfig } from '@/config/type'

import { safeRead, unwrap, wrap } from '@/utils'
import type { ChainId } from '@/utils/chain'
import type { Cast } from '@/utils/type'

import { useState } from '@/modules/state'
import { useEvents_config } from '@/modules/events/use'
import type { ContractsJSONStruct } from '@/modules/contracts'
import type { StoresDefinition } from '@/modules/store'

import type { UpdateParams } from '@/modules/wallet/wallets/base'
import { logger } from '@/modules/wallet/utils'
import type { WalletsDefintion } from '@/modules/wallet/type'

const THIS = (config: EvmConfig) => useWallet_config(config)()

export const useWallet_config = <Wallets extends WalletsDefintion>(
  config: EvmConfig<ContractsJSONStruct, any, any, any, StoresDefinition, Wallets>
) => {
  return () => ({
    async updateStoreState({ wallet, chainId, signer, login = true }: UpdateParams) {
      if (!wallet || !chainId) return

      const state = useState(config)

      state.wallet.signer = wrap(signer)
      state.wallet.wallet = wallet
      state.wallet.realChainId = chainId as ChainId
      state.wallet.login = login
    },
    async connect(walletType: Cast<keyof Wallets | null, string>, chainId?: ChainId) {
      const { wallets } = config
      if (!wallets) return logger.warn('No wallets provided')
      if (!walletType) return

      logger.info(`Connect to "${walletType}"`)

      const useEvents = useEvents_config(config)

      const state = useState(config)
      const whClass = unwrap(state.wallet.walletHandler)
      if (whClass) whClass?.clear()

      const walletHandler = new wallets[walletType](
        config,
        config.chainIds,
        state.wallet.chainId,
        THIS(config).updateStoreState,
        (wallet) => {
          useEvents().emit('onWalletChange', { wallet })
          if (config.options?.updateOnWalletChange) THIS(config).loadAll({ login: true })
        },
        (chainId) => {
          useEvents().emit('onChainChange', { chainId, natural: true })
          if (config.options?.updateOnChainChange)
            THIS(config).loadAll({ init: true, login: true })
        }
      )

      state.wallet.walletType = walletType
      if (!(await walletHandler?.connect())) return

      state.wallet.chainId = chainId ?? state.wallet.chainId

      await THIS(config).loadAll({ init: true, login: true })
    },
    async loadAll({ init = true, login = true }: { init?: boolean; login?: boolean }) {
      const { emit } = useEvents_config(config)()

      if (init) await emit('init', {})
      if (login) await emit('login', {})

      await emit('final', {})
    },
    async signMessage(data: string | Bytes): Promise<string | null> {
      const state = useState(config)

      if (state.wallet.login) {
        const signedMessage = await safeRead<string | null>(
          unwrap(state.wallet.signer)!.signMessage(data),
          null
        )
        return signedMessage
      }
      return null
    },
    async switchChain(chainId: ChainId): Promise<boolean> {
      const { emit } = useEvents_config(config)()
      const state = useState(config)

      const result = Boolean(
        await unwrap(state.wallet.walletHandler)?.switchChain(chainId)
      )
      if (result) emit('onChainChange', { chainId, natural: false })
      return result
    },
    async disconnect(): Promise<boolean> {
      const { _emit } = useEvents_config(config)()
      const state = useState(config)

      await _emit('beforeLogout', {})
      state.wallet.login = false
      state.wallet.wallet = ''
      await _emit('logout', {})

      // setPreservedConnection(this.walletType, false)

      await _emit('afterLogout', {})
      return Boolean(await unwrap(state.wallet.walletHandler)?.disconnect())
    },
  })
}
