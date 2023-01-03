import type { EvmConfig, Module } from '@/config/type'
import { keyOf } from '@/utils'

import { logger } from './utils'

export const main = {
  tools: (config: EvmConfig) => ({
    createState: config.adapter.state.createState,
  }),
  init: async (config, modules) => {
    return true
    // try {
    //   const state = useState(config)
    //   for (const key of keyOf(modules)) {
    //     const fields = modules[key].state?.(config)
    //     for (const name of keyOf(fields)) {
    //       /// @ts-ignore
    //       state[key][name] = fields[key]
    //     }
    //   }
    // } catch (e) {
    //   logger.error(e)
    //   return false
    // }
    // logger.info('Initiated')
    // return true
  },
} satisfies Module
