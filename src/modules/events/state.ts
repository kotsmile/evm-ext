import type { EvmContext, StateFunction } from '@/core/type'

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

export const useEventsState = (ctx: EvmContext) =>
  ctx.adapter.state.createState('$events', state)(ctx)
