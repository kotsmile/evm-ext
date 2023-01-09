import type { Module } from '@/core/type'

import type { ChainParams } from './type'
import { getRpc_ctx, getProvider_ctx } from './node'

export const Chain = (params: ChainParams) => ({
  chain: {
    tools: (ctx) => ({
      getRpc: getRpc_ctx(ctx, params),
      getProvider: getProvider_ctx(ctx, params),
      getChainParams: () => params,
    }),
  } satisfies Module,
})

export * from './type'
export * from './node'
