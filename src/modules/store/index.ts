import { entries } from '@/utils'
import { useEvents_config } from '@/modules/events/use'

import { storeLifecycles, StoreModuleConfig } from './type'
import { logger, onLifecycle } from './utils'
import { defineModule } from '@/config/utils'

export const storeModule = defineModule({
  name: 'store',
  setup: (storeConfig: StoreModuleConfig) => ({
    init: async (config) => {
      try {
        const { stores } = storeConfig

        const useEvents = () => useEvents_config(config)
        const eventsState = useEvents()

        if (stores) {
          for (const [name, store] of entries(stores)) {
            logger.info(`Initiate "${name}" store`)
            for (const lifecycle of storeLifecycles) {
              if (lifecycle === 'init')
                eventsState.addListenerOnce(lifecycle, store[onLifecycle(lifecycle)])
              else eventsState.addListener(lifecycle, store[onLifecycle(lifecycle)])
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
  }),
})

export type {
  OnStoreLifecycle,
  StoreDefinition,
  StoreLifecycle,
  StoreLifecycleCallback,
  StoresDefinition,
  StoreModuleConfig,
} from './type'

export default storeModule
