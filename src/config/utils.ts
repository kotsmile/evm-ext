import type { ToolsFunction, Module, ModuleDefinition } from './type'
import { createLogger } from '@/utils'

export const logger = createLogger('Config')

export const defineModule = <
  Name extends string = string,
  Config extends Record<string, any> = {},
  TF extends ToolsFunction | undefined = ToolsFunction | undefined
>(
  moduleDefinition: ModuleDefinition<Name, Config, TF>
) => ({
  ...moduleDefinition,
  setup: (config: Config) => ({
    ...moduleDefinition.setup(config),
    config,
  }),
})
