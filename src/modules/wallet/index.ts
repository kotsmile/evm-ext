import { logger } from 'ethers'
import type { EvmConfig, Module } from '@/config/type'

import type { ContractsJSONStruct } from '@/modules/contracts'
import type { StoresDefinition } from '@/modules/store'
import { useState } from '@/modules/state'

import type { WalletsDefintion } from '@/modules/wallet/type'
import { useWallet_config } from '@/modules/wallet/use'
import { state } from '@/modules/wallet/state'

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
  state,
} satisfies Module

export type {
  ChangeChainCallbackFunction,
  ChangeWalletCallbackFunction,
  ConnectFunction,
  UpdateStoreStateFunction,
  WalletHandler,
} from './wallets/base'

export type { WalletsDefintion, Options } from './type'
export type { WalletState } from './state'
