import type { Module } from '@/config/type'

import type { ChainParams } from './type'
import { getRpc_config, getProvider_config } from './node'

export const Chain = (params: ChainParams) => ({
  chain: {
    tools: (config) => ({
      getRpc: getRpc_config(config, params),
      getProvider: getProvider_config(config, params),
      getChainParams: () => params,
    }),
  } satisfies Module,
})

export * from './type'
export * from './node'
