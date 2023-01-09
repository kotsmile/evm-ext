import type { RemoveAbstract } from '@/utils/type'
import type { WalletHandler } from './wallets/base'

export type Options = {
  preventDefaultChangeWallet?: boolean
  preventDefaultChangeChain?: boolean
  updateOnWalletChange?: boolean
  updateOnChainChange?: boolean
  preserveConnection?: boolean
  globalLoading?: boolean
}

export type WalletsDefintion = Record<string, RemoveAbstract<typeof WalletHandler>>

export type WalletParams = {
  wallets: WalletsDefintion
  options: Options
}
