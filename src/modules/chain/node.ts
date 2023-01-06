import { providers } from 'ethers'

import type { EvmConfig } from '@/config/type'
import { getChainTag, type ChainId } from '@/utils/chain'

import { logger } from './utils'
import type { ChainModuleConfig } from './type'

export const getRpc_config = (_: EvmConfig, chainConfig: ChainModuleConfig) => {
  const rpcFunction = chainConfig
  if (!rpcFunction) {
    logger.warn('No rpc function in config')
    return () => '__NO_RCP__'
  }
  return (chainId: ChainId) => rpcFunction(getChainTag(chainId)) ?? '__NO_RPC__'
}

export const getProvider_config = (config: EvmConfig, chainConfig: ChainModuleConfig) => {
  return (chainId: ChainId) =>
    new providers.JsonRpcProvider(getRpc_config(config, chainConfig)(chainId))
}
