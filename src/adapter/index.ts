import type { EvmContext, ToolsFunction } from '@/core/type'

export type AdapterDefinition = {
  state: {
    createState<State>(
      name: string,
      state: (ctx: EvmContext) => State
    ): (ctx: EvmContext) => State
  }
  tools?: ToolsFunction
}
