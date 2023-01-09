import type { Module } from '@/core/type'

import { useEventsState } from './state'
import { useEvents_ctx } from './use'
import { logger } from './utils'

export const Events = () => ({
  events: {
    tools: (ctx) => ({
      useEvents: () => useEvents_ctx(ctx),
      useEventsState: () => useEventsState(ctx),
    }),
    init: async (ctx) => {
      try {
        const events = useEvents_ctx(ctx)
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
