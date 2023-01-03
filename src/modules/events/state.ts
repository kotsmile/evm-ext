import type { EvmConfig, StateFunction } from '@/config/type'

import type { CallbackFunction, EventType, Filter } from './type'

export type EventsState = {
  listeners: {
    id: number
    event: EventType
    once: boolean
    callback: CallbackFunction
    filters: Filter<any>[]
  }[]
  listenerId: number
}

export const state: StateFunction<EventsState> = () => {
  return {
    listenerId: 1,
    listeners: [],
  }
}

export const useEventsState = (config: EvmConfig) =>
  config.adapter.state.createState('$events', state)(config)
