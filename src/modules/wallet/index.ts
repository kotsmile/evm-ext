import { logger } from 'ethers'
import type { EvmConfig, Module } from '../../config/type'
import type { ContractsJSONStruct } from '../contracts'
import { useState } from '../state'
import type { StoresDefinition } from '../store'
import type { WalletsDefintion } from './type'

import { useWallet_config } from './wallet.state'
export type { WalletState } from './wallet.state'

export default {
  tools: <Wallets extends WalletsDefintion>(
    config: EvmConfig<ContractsJSONStruct, any, any, any, StoresDefinition, Wallets>
  ) => {
    return {
      useWallet: useWallet_config<Wallets>(config),
    }
  },
  init: async (config) => {
    const state = useState(config)
    state.wallet.chainId = state.wallet.DEFAULT_CHAINID = config.DEFAULT_CHAINID
    state.wallet.chainIds = config.chainIds
    logger.info('Initiated')
    return true
  },
} satisfies Module

export type {
  ChangeChainCallbackFunction,
  ChangeWalletCallbackFunction,
  ConnectFunction,
  UpdateStoreStateFunction,
  WalletHandler,
} from './wallets/base'

export type { WalletsDefintion, Options } from './type'
