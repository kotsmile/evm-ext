import { providers } from 'ethers'

import type { EvmConfig } from '../../../config/type'

import type { ISigner } from '../../../utils'
import type { ChainId } from '../../../utils/chain'

import { events } from './utils'

export type ConnectFunction = (
  wallet: string,
  signer: ISigner,
  chainId: ChainId,
  login?: boolean
) => Promise<void>

export type ChangeWalletCallbackFunction = (wallet: string) => void
export type ChangeChainCallbackFunction = (chainId: string) => void

export type UpdateParams = {
  signer: ISigner
  wallet: string | null
  chainId: string | null
  login?: boolean
}
export type UpdateStoreStateFunction = (params: UpdateParams) => Promise<void>

export abstract class WalletHandler {
  public provider: providers.Web3Provider | providers.JsonRpcProvider | null = null
  public signer: ISigner = null
  public address: string | null = null
  public chainId: string | null = null
  public nativeProvider: any
  public actual = true

  constructor(
    public config: EvmConfig,
    public chainIds: readonly ChainId[],
    public defaultChainId: ChainId,
    public updateStoreState: UpdateStoreStateFunction,
    public changeWalletCallback?: ChangeWalletCallbackFunction,
    public changeChainCallback?: ChangeChainCallbackFunction
  ) {}

  abstract connect(): Promise<boolean>
  abstract disconnect(): Promise<boolean>
  abstract switchChain(chainId: ChainId): Promise<boolean>
  abstract addChain(chainId: ChainId): Promise<boolean>

  async updateProviderState() {
    this.provider = new providers.Web3Provider(this.nativeProvider)

    this.signer = await this.getSigner()
    this.address = await this.getAddress()
    this.chainId = await this.getChainId()

    await this.updateStoreState({
      signer: this.signer,
      wallet: this.address,
      chainId: this.chainId,
    })
  }
  async changeChainHandler(chainId: number) {
    if (!this.actual) return
    this.nativeProvider.once(events.CHANGE_CHAIN, this.changeChainHandler?.bind(this))
    chainId = parseInt(chainId.toString())
    if (this.chainId && parseInt(this.chainId) === chainId) return

    if (!this.config.options?.preventDefaultChangeChain) {
      await this.updateProviderState()
      if (!this.chainIds.includes(chainId.toString() as ChainId))
        return await this.switchChain(this.defaultChainId)
    }

    this.changeChainCallback?.(chainId.toString())
  }
  async changeWalletHanlder(accounts: string[]) {
    if (!this.actual) return
    this.nativeProvider.once(events.CHANGE_WALLET, this.changeWalletHanlder?.bind(this))

    if (accounts[0] === this.address) return
    if (!this.config.options?.preventDefaultChangeWallet) {
      await this.updateProviderState()
    }
    this.changeWalletCallback?.(accounts[0])
  }
  clear() {
    this.actual = false
  }
  async getSigner(): Promise<ISigner> {
    return this.provider?.getSigner() ?? null
  }
  async getChainId(): Promise<string | null> {
    return (await this.provider?.getNetwork())?.chainId.toString() ?? null
  }
  async getAddress(): Promise<string | null> {
    return (await this.getSigner())?.getAddress() ?? null
  }
}
