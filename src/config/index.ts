import modules from '@/modules'
import type {
  ContractsJSONStruct,
  ContractsDefinition,
  AppChainIds,
} from '@/modules/contracts/type'
import type { StoresDefinition } from '@/modules/store/type'
import type { WalletsDefintion } from '@/modules/wallet/type'
import type { AdapterDefinition } from '@/adapter'

import type { EvmConfig, Module } from '@/config/type'
import { logger } from '@/config/utils'

import { disableLogger, entries, keyOf } from '@/utils'
import type { RT } from '@/utils/type'

export const defineEvmConfig = <M extends Record<string, Module> = {}>(
  config: EvmConfig<M>
) => {
  if (config.DEBUG === false) disableLogger()

  /// TODO: fix empty modules type problem
  const tools = {} as {
    [K in keyof M]: RT<M[K]['tools']>
  }[keyof M]
  // init tools
  for (const name of keyOf(config.modules)) {
    const module = config.modules[name]
    if (!module.tools) continue
    for (const [name, moduleTools] of entries(module.tools(config))) {
      /// @ts-ignore(config)
      tools[name] = moduleTools
    }
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
