import type { Module } from '@/config/type'

import { useEventsState } from './state'
import { useEvents_config } from './use'
import { logger } from './utils'

export const EventsModule = () => ({
  events: {
    tools: (config) => ({
      useEvents: () => useEvents_config(config),
      useEventsState: () => useEventsState(config),
    }),
    init: async (config) => {
      try {
        const events = useEvents_config(config)
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

export * from './state'
export * from './type'
export * from './utils'
export * from './use'
