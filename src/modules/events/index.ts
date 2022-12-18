import type { Module } from '@/config/type'
import { useState } from '@/modules/state'

import { state } from '@/modules/events/state'
import { useEvents_config } from '@/modules/events/use'

export default {
  tools: (config) => {
    return {
      useEvents: useEvents_config(config),
    }
  },
  init: async () => {
    return true
  },
  state,
} satisfies Module

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
