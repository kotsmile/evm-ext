import type { AdapterDefinition } from '@/adapter'
import type { EvmContext, Module, ToolsFunction } from '@/core/type'
import { logger } from '@/core/utils'

import { disableLogger, keyOf } from '@/utils'
import type { RT } from '@/utils/type'

export const defineEvm = <M extends Record<string, Module>, A extends AdapterDefinition>(
  ctx: EvmContext<M, A>
) => {
  if (!ctx.DEBUG) disableLogger()

  const modulesTools = {} as {
    [K in keyof M]: RT<M[K]['tools']>
  }

  // init tools
  if (ctx.modules)
    for (const moduleName of keyOf(ctx.modules)) {
      const { tools } = ctx.modules[moduleName]
      if (!tools) continue
      modulesTools[moduleName] = tools(ctx) as any
    }

  return () => ({
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
  })
}

export * from './type'
export * from './utils'
