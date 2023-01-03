import type { EvmConfig, ToolsFunction } from '@/config/type'

export type AdapterDefinition<AdapterTools = any> = {
  state: {
    createState<State>(
      name: string,
      state: (config: EvmConfig) => State
    ): (config: EvmConfig) => State
  }
  tools?: ToolsFunction<AdapterTools>
}
