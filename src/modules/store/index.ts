import type { Module } from '../../config/type'

import { entries } from '../../utils'
import { useEvents_config } from '../events/event.state'
import { storeLifecycles } from './type'
import { logger, onLifecycle } from './utils'

export default {
  init: async (config) => {
    const { stores } = config

    const useEvents = useEvents_config(config)
    const { addListener, addListenerOnce, emit } = useEvents()

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

    logger.info('Initiated')

    await emit('init', {})
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
} from './type'
