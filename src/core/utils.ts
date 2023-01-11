import type { F } from 'ts-toolbelt'

import { createLogger, keyOf, EVMError, type RT } from '@/utils'

import type { EvmContext, ModuleType } from './type'

export const logger = createLogger('Core')

export const getModuleName = <Name extends string, M extends ModuleType>(
  module: (...args: any[]) => Record<Name, M>
) => {
  const initedModule = module()
  return keyOf(initedModule)[0]
}

export const useModule = <Name extends string, M extends ModuleType>(
  ctx: EvmContext,
  module: (...args: any[]) => Record<Name, M>
) => {
  const name = getModuleName(module)

  if (!ctx.modules) throw new EVMError(`Not found module "${name}"`)

  if (name in ctx.modules) {
    return ctx.modules[name].tools?.(ctx) as RT<M['tools']>
  } else {
    throw new EVMError(`Not found module "${name}"`)
  }
}

export const useModuleSafe = <Name extends string, M extends ModuleType>(
  ctx: EvmContext,
  module: (...args: any[]) => Record<Name, M>
) => {
  try {
    return useModule(ctx, module)
  } catch (e) {
    logger.warn(`Not found module "${name}"`)
    return null
  }
}

export const Module = <N extends string, D extends string[], M extends ModuleType>(
  name: N,
  module: M,
  deps?: F.Narrow<D>
) => {
  return {
    [name]: { ...module, deps },
  } as Record<N, M & { deps: D }>
}
