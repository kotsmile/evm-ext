import { wrapState, type ISigner, type WrapState } from '@/utils'
import type { ChainId } from '@/utils/chain'
import type { StateFunction } from '@/config/type'

import type { WalletHandler } from './wallets/base'

export type WalletState = {
  wallet: {
    wallet: string
    signer: WrapState<ISigner>
    chainId: ChainId
    realChainId: ChainId | null
    chainIds: ChainId[]
    DEFAULT_CHAINID: ChainId
    login: boolean
    loading: boolean
    walletType: string | null
    walletHandler: WrapState<WalletHandler | null>
  }
}

const DEF_CHAINID: ChainId = '1'
export const state: StateFunction<'wallet', WalletState> = (config) => {
  return {
    wallet: '',
    signer: wrapState(null),
    chainId: config.DEFAULT_CHAINID ?? DEF_CHAINID,
    realChainId: DEF_CHAINID,
    chainIds: config.chainIds ?? [DEF_CHAINID],
    DEFAULT_CHAINID: config.DEFAULT_CHAINID ?? DEF_CHAINID,
    login: false,
    loading: false,
    walletType: null,
    walletHandler: wrapState(null),
  }
}
