import { wrapState, type ISigner, type WrapState } from '@/utils'
import type { ChainId } from '@/utils/chain'
import type { EvmConfig, StateFunction } from '@/config/type'

import type { WalletHandler } from './wallets/base'
import { useModule } from '@/config/utils'
import { Contracts } from '@/modules'

export type WalletState = {
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

const DEF_CHAINID: ChainId = '1'

export const state: StateFunction<WalletState> = (config) => {
  const contracts = useModule(config, Contracts)

  return {
    wallet: '',
    signer: wrapState(null),
    chainId: (contracts.getContractsParams().DEFAULT_CHAINID as ChainId) ?? DEF_CHAINID,
    realChainId: DEF_CHAINID,
    chainIds: (contracts.getContractsParams().chainIds as ChainId[]) ?? [DEF_CHAINID],
    DEFAULT_CHAINID:
      (contracts.getContractsParams().DEFAULT_CHAINID as ChainId) ?? DEF_CHAINID,
    login: false,
    loading: false,
    walletType: null,
    walletHandler: wrapState(null),
  }
}

export const useWalletState = (config: EvmConfig) =>
  config.adapter.state.createState('$wallet', state)(config)
