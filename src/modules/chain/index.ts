import { Module } from '@/core'

import type { ChainParams } from './type'
import { getRpc_ctx, getProvider_ctx } from './node'

export const Chain = (params: ChainParams = () => '__NO_RRC__') =>
  Module('chain', {
    tools: (ctx) => ({
      getRpc: getRpc_ctx(ctx, params),
      getProvider: getProvider_ctx(ctx, params),
      getChainParams: () => params,
    }),
  })

export * from './type'
export * from './node'
