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

export const defineEvmConfig = <M extends Module[] = Module[]>(config: EvmConfig<M>) => {
  if (config.DEBUG === false) disableLogger()

  /// TODO: fix empty modules type problem
  const tools = {} as RT<M[number]['tools']>
  // init tools
  for (const module of config.modules) {
    if (!module.tools) continue
    for (const [name, moduleTools] of entries(module.tools(config))) {
      /// @ts-ignore(config)
      tools[name] = moduleTools
    }
  }

  return () => ({
    /// inits every module
    init: async () => {
      // logger.info('Init modules')
      // const modules_: Record<string, Module> = modules
      // // not defered modules
      // for (const name of keyOf(modules_)) {
      //   const mod = modules_[name]
      //   if (mod.defer) continue
      //   await mod.init?.(config, modules).then((r) => {
      //     if (!r) logger.error(`Cant init ${name} module`)
      //   })
      // }
      // // defered modules
      // for (const name of keyOf(modules_)) {
      //   const mod = modules_[name]
      //   if (!mod.defer) continue
      //   await mod.init?.(config, modules).then((r) => {
      //     if (!r) logger.error(`Cant init ${name} module`)
      //   })
      // }
    },
    config,
    ...tools,
  })
}
