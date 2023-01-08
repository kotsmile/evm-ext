import type { Module } from '@/config/type'

import type { ChainModuleConfig } from './type'
import { getRpc_config, getProvider_config } from './node'

export default (chainConfig: ChainModuleConfig) => ({
  chain: {
    tools: (config) => ({
      getRpc: getRpc_config(config, chainConfig),
      getProvider: getProvider_config(config, chainConfig),
      getChainConfig: () => chainConfig,
    }),
  } satisfies Module,
})

export * from './type'
export * from './node'
