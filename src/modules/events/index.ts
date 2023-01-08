import type { EvmConfig, Module } from '@/config/type'

import { useEventsState } from './state'
import { useEvents_config } from './use'
import { logger } from './utils'

export const eventsModule = () => ({
  events: {
    tools: (config) => ({
      useEvents: () => useEvents_config(config),
      useEventsState: () => useEventsState(config),
    }),
    init: async (config) => {
      try {
        const events = useEvents(config)
        await events.emit('init', {})
      } catch (e) {
        logger.error(e)
        return false
      }
      logger.info('Initiated')
      return true
    },
    defer: true,
  } satisfies Module,
})

export const useEvents = (config: EvmConfig) => useEvents_config(config)

export * from './state'
export * from './type'
export * from './utils'

export default eventsModule
