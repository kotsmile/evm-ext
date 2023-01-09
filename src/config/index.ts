import type { AdapterDefinition } from '@/adapter'
import type { EvmConfig, Module } from '@/config/type'
import { logger } from '@/config/utils'

import { disableLogger, keyOf } from '@/utils'
import type { RT } from '@/utils/type'

export const defineEvmConfig = <
  M extends Record<string, Module>,
  A extends AdapterDefinition
>(
  config: EvmConfig<M, A>
) => {
  if (!config.DEBUG) disableLogger()

  const modulesTools = {} as {
    [K in keyof M]: RT<M[K]['tools']>
  }

  // init tools
  if (config.modules)
    for (const moduleName of keyOf(config.modules)) {
      const module = config.modules[moduleName]
      if (!module.tools) continue
      /// @ts-ignore
      modulesTools[moduleName] = module.tools(config)
    }

  return () => ({
    /// inits every module
    init: async () => {
      if (!config.modules) return

      logger.info('Init modules')

      for (const name of keyOf(config.modules).sort(
        (n1) => (config.modules?.[n1].defer ? 1 : -1) // defered modules at the end
      )) {
        logger.info(`Init ${String(name)}...`)

        await config.modules[name]
          .init?.(config)
          .then((r) => {
            if (!r) logger.error(`Cant init ${String(name)} module`)
          })
          .catch((e) => logger.error(`Cant init ${String(name)} module: ${e}`))
      }
    },
    config,
    ...modulesTools,
    /// TODO: make spread
    tools: config.adapter.tools?.(config) as A['tools'] extends undefined
      ? never
      : RT<A['tools']>,
  })
}
