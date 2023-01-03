import type { EvmConfig, Module } from '@/config/type'

import type { ContractsJSONStruct } from '@/modules/contracts'
import type { StoresDefinition } from '@/modules/store'

import type { WalletsDefintion } from './type'
import { useWallet_config } from './use'
import { useWalletState } from './state'
import { logger } from './utils'

export const main = {
  tools: <Wallets extends WalletsDefintion>(
    config: EvmConfig<ContractsJSONStruct, any, any, any, StoresDefinition, Wallets>
  ) => {
    return {
      useWallet: () => useWallet_config<Wallets>(config),
      useWalletState: () => useWalletState(config),
    }
  },
  init: async (config) => {
    try {
      const wallet = useWalletState(config)
      wallet.chainId = wallet.DEFAULT_CHAINID = config.DEFAULT_CHAINID
      wallet.chainIds = config.chainIds
    } catch (e) {
      logger.error(e)
      return false
    }
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
export type { WalletState } from './state'
