import type { EvmConfig } from '../../config/type'

import { getRpc_config, getProvider_config } from './node'

export { init } from './init'

export default (config: EvmConfig) => {
  return {
    getRpc: getRpc_config(config),
    getProvider: getProvider_config(config),
  }
}

export type { RpcDefinition } from './type'
