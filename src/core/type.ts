import type { AdapterDefinition } from '@/adapter'

export type EvmContext<
  Modules extends Record<string, Module> = Record<string, Module>,
  Adapter extends AdapterDefinition = AdapterDefinition
> = {
  DEBUG?: boolean
  readonly adapter: Adapter
  readonly modules?: Modules
}

export type InitFunction = (ctx: EvmContext) => Promise<boolean>
export type ToolsFunction = (ctx: EvmContext) => Record<string, any>

export type StateFunction<S extends Record<string, any> = any> = (ctx: EvmContext) => S

export type Module = {
  tools?: ToolsFunction
  init?: InitFunction
  defer?: boolean
}
export type ModuleDefinition = Record<string, Module>
