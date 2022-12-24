import type { Module } from '@/config/type'

import { entries } from '@/utils'
import { useEvents_config } from '@/modules/events/use'

import { storeLifecycles } from '@/modules/store/type'
import { logger, onLifecycle } from '@/modules/store/utils'

export default {
  init: async (config) => {
    try {
      const { stores } = config

      const useEvents = useEvents_config(config)
      const { addListener, addListenerOnce } = useEvents()

      if (stores) {
        for (const [name, store] of entries(stores)) {
          logger.info(`Initiate ${name} store`)
          for (const lifecycle of storeLifecycles) {
            if (lifecycle === 'init')
              addListenerOnce(lifecycle, store[onLifecycle(lifecycle)])
            else addListener(lifecycle, store[onLifecycle(lifecycle)])
          }
        }
      }
    } catch (e) {
      logger.error(e)
      return false
    }
    logger.info('Initiated')
    return true
  },
  defer: true,
} satisfies Module

export type {
  OnStoreLifecycle,
  StoreDefinition,
  StoreLifecycle,
  StoreLifecycleCallback,
  StoresDefinition,
} from '@/modules/store/type'
