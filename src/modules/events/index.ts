import type { EvmConfig, Module } from '@/config/type'

import { state } from './state'
import { useEvents_config } from './use'
import { logger } from './utils'

export default {
  tools: (config) => {
    return {
      useEvents: useEvents_config(config),
    }
  },
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
  state,
} satisfies Module

export const useEvents = (config: EvmConfig) => useEvents_config(config)()

export type { EventsState } from './state'
export type {
  AfterEvent,
  BeforeEvent,
  CallbackFunction,
  EventType,
  Events,
  Filter,
  RawEventType,
  RawEvents,
} from './type'
export { toAfterEvent, toBeforeEvent } from './utils'
