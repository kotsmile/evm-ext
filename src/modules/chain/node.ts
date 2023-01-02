import { providers } from 'ethers'

import type { EvmConfig } from '@/config/type'
import { getChainTag, type ChainId } from '@/utils/chain'

import { logger } from './utils'

export const getRpc_config = (config: EvmConfig) => {
  const rpcFunction = config.rpc
  if (!rpcFunction) {
    logger.warn('No rpc function in config')
    return () => '__NO_RCP__'
  }
  return (chainId: ChainId) => rpcFunction(getChainTag(chainId)) ?? '__NO_RPC__'
}

export const getProvider_config = (config: EvmConfig) => {
  return (chainId: ChainId) =>
    new providers.JsonRpcProvider(getRpc_config(config)(chainId))
}
