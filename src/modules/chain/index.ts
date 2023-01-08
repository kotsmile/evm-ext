import type { Module } from '@/config/type'

import type { ChainModuleConfig } from './type'
import { getRpc_config, getProvider_config } from './node'

export const chainModule = (chainConfig: ChainModuleConfig) => ({
  chain: {
    tools: (config) => ({
      getRpc: getRpc_config(config, chainConfig),
      getProvider: getProvider_config(config, chainConfig),
    }),
  } satisfies Module,
})

export * from './type'
export * from './node'

export default chainModule
