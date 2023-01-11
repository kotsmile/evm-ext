import type { AdapterDefinition } from '@/adapter'
import type { EvmContext, ModuleType } from '@/core/type'
import { logger } from '@/core/utils'

import { disableLogger, keyOf } from '@/utils'
import { EVMError } from '@/utils/error'
import type { RT } from '@/utils/type'

type DependecyOk<M extends Record<string, ModuleType>> = Extract<
  Exclude<M[keyof M]['deps'], undefined>[number],
  keyof M
>

export const defineEvm = <
  M extends Record<string, ModuleType>,
  A extends AdapterDefinition
>(
  ctx: EvmContext<M, A>
) => {
  if (!ctx.DEBUG) disableLogger()

  const modulesTools = {} as {
    [K in keyof M]: RT<M[K]['tools']>
  }

  if (ctx.modules) {
    /// dependency check
    let problems = 0
    for (const name of keyOf(ctx.modules)) {
      const deps = ctx.modules[name].deps
      if (deps && deps.length > 0) {
        for (const dep of deps) {
          if (ctx.modules[dep as keyof typeof ctx.modules]) continue
          problems++
          logger.error(`Module "${String(name)}" requiers module "${dep}"`)
        }
      }
    }
    if (problems > 0) throw new EVMError('Dependency problems')

    // init tools
    for (const moduleName of keyOf(ctx.modules)) {
      const { tools } = ctx.modules[moduleName]
      if (!tools) continue
      modulesTools[moduleName] = tools(ctx) as any
    }
  }

  const use = () => ({
    /// inits every module
    init: async () => {
      if (!ctx.modules) return

      logger.info('Init modules')

      for (const name of keyOf(ctx.modules).sort(
        (n1) => (ctx.modules?.[n1].defer ? 1 : -1) // defered modules at the end
      )) {
        logger.info(`Init ${String(name)}...`)

        await ctx.modules[name]
          .init?.(ctx)
          .then((r) => {
            if (!r) logger.error(`Cant init ${String(name)} module`)
          })
          .catch((e) => logger.error(`Cant init ${String(name)} module: ${e}`))
      }
    },
    ctx,
    ...modulesTools,
    /// TODO: make spread
    tools: ctx.adapter.tools?.(ctx) as A['tools'] extends undefined
      ? never
      : RT<A['tools']>,
    d: {} as DependecyOk<M>,
  })

  type F = DependecyOk<M> extends never ? typeof use : never
  return use as F
}

export * from './type'
export * from './utils'
