import { Metamask } from './types/metamask'
import { Walletconnect } from './types/walletconnect'
import { CoinBase } from './types/coinbase'

export const wallets = {
  metamask: Metamask,
  walletconnect: Walletconnect,
  coinbase: CoinBase,
  // native: Native,
  // trustwallet: TrustWallet,
}

export type WalletType = keyof typeof wallets
