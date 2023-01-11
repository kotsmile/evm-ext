import { Module, useModule } from '@/core'
import { entries } from '@/utils'

import { Events } from '@/modules'

import { storeLifecycles, StoreParams } from './type'
import { logger, onLifecycle } from './utils'

export const Store = (params: StoreParams = { stores: {} }) =>
  Module(
    'store',
    {
      init: async (ctx) => {
        try {
          const { stores } = params

          const events = useModule(ctx, Events)
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
        getStoreParams: () => params,
      }),
    },
    ['events']
  )

export * from './type'
export * from './utils'
