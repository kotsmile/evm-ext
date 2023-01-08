import type { Module } from '@/config/type'
import { entries } from '@/utils'

import { useModule } from '@/config/utils'
import { EventsModule } from '@/modules'

import { storeLifecycles, StoreModuleConfig } from './type'
import { logger, onLifecycle } from './utils'

export default (storeConfig: StoreModuleConfig) => ({
  store: {
    init: async (config) => {
      try {
        const { stores } = storeConfig

        const events = useModule(config, EventsModule)
        const eventsTools = events.useEvents()

        if (stores) {
          for (const [name, store] of entries(stores)) {
            logger.info(`Initiate "${name}" store`)
            for (const lifecycle of storeLifecycles) {
              if (lifecycle === 'init')
                eventsTools.addListenerOnce(lifecycle, store[onLifecycle(lifecycle)])
              else eventsTools.addListener(lifecycle, store[onLifecycle(lifecycle)])
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
    tools: () => ({
      getStoreConfig: () => storeConfig,
    }),
  } satisfies Module,
})

export * from './type'
export * from './utils'
