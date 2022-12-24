import type { ISigner, Wrap } from '@/utils'
import { wrap } from '@/utils'

import type { ChainId } from '@/utils/chain'

import type { WalletHandler } from '@/modules/wallet/wallets/base'
import type { StateFunction } from '@/config/type'

export type WalletState = {
  wallet: {
    wallet: string
    signer: Wrap<ISigner>
    chainId: ChainId
    realChainId: ChainId | null
    chainIds: ChainId[]
    DEFAULT_CHAINID: ChainId
    login: boolean
    loading: boolean
    walletType: string | null
    walletHandler: Wrap<WalletHandler | null>
  }
}

const DEF_CHAINID: ChainId = '1'
export const state: StateFunction<'wallet', WalletState> = (config) => {
  return {
    wallet: '',
    signer: wrap(null),
    chainId: config.DEFAULT_CHAINID ?? DEF_CHAINID,
    realChainId: DEF_CHAINID,
    chainIds: config.chainIds ?? [DEF_CHAINID],
    DEFAULT_CHAINID: config.DEFAULT_CHAINID ?? DEF_CHAINID,
    login: false,
    loading: false,
    walletType: null,
    walletHandler: wrap(null),
  }
}