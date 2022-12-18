import { keyOf } from '@/utils'
import type { EvmConfig, Module } from '@/config/type'

const main = {
  tools: (config: EvmConfig) => {
    return config.adapter().state
  },
  init: async (config, modules) => {
    const state = useState(config)

    for (const key of keyOf(modules)) {
      const fields = modules[key].state?.(config)
      for (const name of keyOf(fields)) {
      }
    }
    return true
  },
} satisfies Module
export default main

export const useState = main.tools
export type { State, Namespace, Key, Value } from './schema'
