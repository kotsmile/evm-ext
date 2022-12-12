import type { providers, Wallet, Signer, VoidSigner } from 'ethers'

export type ISigner = providers.JsonRpcSigner | Wallet | Signer | VoidSigner | null
export type INotNullSigner = NonNullable<ISigner>
