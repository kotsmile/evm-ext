import type { EvmConfig, InitFunction, Module } from '../../config/type'
import state_module from '../state'

import { useEvents_config } from './event.state'

export default {
  tools: (config) => {
    return {
      useEvents: useEvents_config(config),
    }
  },
  init: async (config) => {
    const state = state_module.tools(config)
    state.events.listenerId = 1
    state.events.listeners = []
    return true
  },
} satisfies Module

export type { EventsState } from './event.state'
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
