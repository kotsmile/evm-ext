import { createLogger, keyOf } from '@/utils'
import type { RT } from '@/utils/type'
import type { EvmConfig, Module } from './type'

export const logger = createLogger('Config')

export const getModuleName = <Name extends string, M extends Module>(
  module: (...args: any[]) => Record<Name, M>
) => {
  const initedModule = module()
  return keyOf(initedModule)[0]
}

export const useModule = <Name extends string, M extends Module>(
  config: EvmConfig,
  module: (...args: any[]) => Record<Name, M>
) => {
  const name = getModuleName(module)

  if (!config.modules) return undefined

  if (name in config.modules) {
    return config.modules[name].tools?.(config) as RT<M['tools']>
  } else {
    logger.error(`Not found module "${name}"`)
    return undefined
  }
}
