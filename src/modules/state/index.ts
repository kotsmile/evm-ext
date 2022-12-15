import type { EvmConfig, Module } from '../../config/type'

const main = {
  tools: (config: EvmConfig) => {
    return config.adapter().state
  },
} satisfies Module
export default main

export const useState = main.tools
export type { State, Namespace, Key, Value } from './schema'
