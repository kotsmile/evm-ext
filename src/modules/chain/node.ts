import { providers } from 'ethers'

import type { EvmContext } from '@/core/type'
import { getChainTag, type ChainId } from '@/utils/chain'

import { logger } from './utils'
import type { ChainParams } from './type'

export const getRpc_ctx = (_: EvmContext, params: ChainParams) => {
  const rpcFunction = params
  if (!rpcFunction) {
    logger.warn('No rpc function in ctx')
    return () => '__NO_RPC__'
  }
  return (chainId: ChainId) => rpcFunction(getChainTag(chainId)) ?? '__NO_RPC__'
}

export const getProvider_ctx = (ctx: EvmContext, params: ChainParams) => {
  return (chainId: ChainId) =>
    new providers.JsonRpcProvider(getRpc_ctx(ctx, params)(chainId))
}
