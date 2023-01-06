import type { WalletHandler } from './wallets/base'

export type Options = {
  preventDefaultChangeWallet?: boolean
  preventDefaultChangeChain?: boolean
  updateOnWalletChange?: boolean
  updateOnChainChange?: boolean
  preserveConnection?: boolean
  globalLoading?: boolean
}

type RemoveAbstract<C extends abstract new (...args: any) => any> = new (
  ...args: ConstructorParameters<C>
) => InstanceType<C>

export type WalletsDefintion = Record<string, RemoveAbstract<typeof WalletHandler>>
export type WalletModuleConfig = { wallets: WalletsDefintion }
