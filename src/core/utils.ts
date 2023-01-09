import { createLogger, keyOf } from '@/utils'
import type { RT } from '@/utils/type'
import type { EvmContext, Module } from './type'

export const logger = createLogger('Config')

export const getModuleName = <Name extends string, M extends Module>(
  module: (...args: any[]) => Record<Name, M>
) => {
  const initedModule = module()
  return keyOf(initedModule)[0]
}

export const useModule = <Name extends string, M extends Module>(
  ctx: EvmContext,
  module: (...args: any[]) => Record<Name, M>
) => {
  const name = getModuleName(module)

  if (!ctx.modules) throw new Error(`Not found module "${name}"`)

  if (name in ctx.modules) {
    return ctx.modules[name].tools?.(ctx) as RT<M['tools']>
  } else {
    throw new Error(`Not found module "${name}"`)
  }
}
