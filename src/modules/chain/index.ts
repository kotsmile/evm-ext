import type { EvmConfig, Module } from '@/config/type'

import { getRpc_config, getProvider_config } from '@/modules/chain/node'

export default {
  tools: (config: EvmConfig) => {
    return {
      getRpc: getRpc_config(config),
      getProvider: getProvider_config(config),
    }
  },
} satisfies Module

export type { RpcDefinition } from '@/modules/chain/type'
