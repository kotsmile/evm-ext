import type { EvmConfig, Module } from '@/config/type'
import { logger } from '@/config/utils'

import { disableLogger, entries, keyOf } from '@/utils'
import type { RT } from '@/utils/type'

export const defineEvmConfig = <M extends Record<string, Module>>(
  config: EvmConfig<M>
) => {
  if (config.DEBUG === false) disableLogger()

  /// TODO: fix empty modules type problem
  const tools = {} as {
    [K in keyof M]: RT<M[K]['tools']>
  }

  // init tools
  for (const moduleName of keyOf(config.modules)) {
    const module = config.modules[moduleName]
    if (!module.tools) continue
    /// @ts-ignore
    tools[moduleName] = module.tools(config)
  }

  return () => ({
    /// inits every module
    init: async () => {
      logger.info('Init modules')

      /// TODO same code :((
      // not defered modules
      for (const name of keyOf(config.modules)) {
        const module = config.modules[name]
        if (module.defer) continue
        await module
          .init?.(config)
          .then((r) => {
            if (!r) logger.error(`Cant init ${String(name)} module`)
          })
          .catch((e) => logger.error(`Cant init ${String(name)} module: ${e}`))
      }

      // defered modules
      for (const name of keyOf(config.modules)) {
        const module = config.modules[name]
        if (!module.defer) continue
        await module
          .init?.(config)
          .then((r) => {
            if (!r) logger.error(`Cant init ${String(name)} module`)
          })
          .catch((e) => logger.error(`Cant init ${String(name)} module: ${e}`))
      }
    },
    config,
    ...tools,
  })
}
