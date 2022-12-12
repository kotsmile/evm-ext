import type { EvmConfig } from '../../config/type'
import type { ContractsJSONStruct } from '../contracts'
import type { StoresDefinition } from '../store'
import type { WalletsDefintion } from './type'

import { useWallet_config } from './wallet.state'
export type { WalletState } from './wallet.state'

export { init } from './init'

export default <Wallets extends WalletsDefintion>(
  config: EvmConfig<ContractsJSONStruct, any, any, any, StoresDefinition, Wallets>
) => {
  return {
    useWallet: useWallet_config<Wallets>(config),
  }
}

export type {
  ChangeChainCallbackFunction,
  ChangeWalletCallbackFunction,
  ConnectFunction,
  UpdateStoreStateFunction,
  WalletHandler,
} from './wallets/base'

export type { WalletsDefintion, Options } from './type'
