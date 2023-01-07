import { defineModule } from '@/config/utils'

import type { ChainModuleConfig } from './type'
import { getRpc_config, getProvider_config } from './node'

export const chainModule = defineModule({
  name: 'chain',
  setup: (chainConfig: ChainModuleConfig) => ({
    tools: (config) => ({
      getRpc: getRpc_config(config, chainConfig),
      getProvider: getProvider_config(config, chainConfig),
    }),
  }),
})

export type { RpcDefinition, ChainModuleConfig } from './type'
export { getRpc_config, getProvider_config } from './node'

export default chainModule
