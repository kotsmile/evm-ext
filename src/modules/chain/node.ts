import { providers } from 'ethers'

import type { ChainId } from '../../utils/chain'
import { getChainTag } from '../../utils/chain'

import type { EvmConfig } from '../../config/type'

import { warn } from './utils'

export const getRpc_config = <C extends EvmConfig>(config: C) => {
  if (!config.rpc) {
    warn('No rpc function in config', config)
    return () => '__NO_RCP__'
  }
  return (chainId: ChainId) => config.rpc?.(getChainTag(chainId)) ?? '__NO_RPC__'
}

export const getProvider_config = <C extends EvmConfig>(config: C) => {
  return (chainId: ChainId) =>
    new providers.JsonRpcProvider(getRpc_config(config)(chainId))
}
