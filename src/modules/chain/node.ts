import { providers } from 'ethers'

import type { EvmConfig } from '@/config/type'
import type { ChainId } from '@/utils/chain'
import { getChainTag } from '@/utils/chain'

import { logger } from './utils'

export const getRpc_config = (config: EvmConfig) => {
  if (!config.rpc) {
    logger.warn('No rpc function in config')
    return () => '__NO_RCP__'
  }
  return (chainId: ChainId) => config.rpc?.(getChainTag(chainId)) ?? '__NO_RPC__'
}

export const getProvider_config = (config: EvmConfig) => {
  return (chainId: ChainId) =>
    new providers.JsonRpcProvider(getRpc_config(config)(chainId))
}
