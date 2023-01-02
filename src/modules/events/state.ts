import type { StateFunction } from '@/config/type'

import type { CallbackFunction, EventType, Filter } from './type'

export type EventsState = {
  events: {
    listeners: {
      id: number
      event: EventType
      once: boolean
      callback: CallbackFunction
      filters: Filter<any>[]
    }[]
    listenerId: number
  }
}

export const state: StateFunction<'events', EventsState> = () => {
  return {
    listenerId: 1,
    listeners: [],
  }
}
