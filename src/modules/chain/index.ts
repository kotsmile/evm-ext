import type { EvmConfig, Module } from '@/config/type'

import type { ChainModuleConfig } from './type'
import { getRpc_config, getProvider_config } from './node'

export const main = (chainConfig: ChainModuleConfig) =>
  ({
    name: 'Chain',
    tools: (config: EvmConfig) => ({
      getRpc: getRpc_config(config, chainConfig),
      getProvider: getProvider_config(config, chainConfig),
    }),
  } satisfies Module)

export type { RpcDefinition, ChainModuleConfig } from './type'
export { getRpc_config, getProvider_config } from './node'

export default main
