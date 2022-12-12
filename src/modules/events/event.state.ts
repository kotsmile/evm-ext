import type { EvmConfig } from '../../config/type'
import type { Events, CallbackFunction, EventType, Filter, RawEventType } from './type'

import { emitMsg, toAfterEvent, toBeforeEvent } from './utils'

import state_module from '../state'

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

const THIS = (config: EvmConfig) => useEvents_config(config)()

export const useEvents_config = (config: EvmConfig) => {
  return () => ({
    addListener<Event extends EventType>(
      event: Event,
      callback: (args: Events[Event]['args']) => any,
      filters: Filter<Event>[] = []
    ): number {
      return THIS(config)._addListener(event, callback, filters)
    },
    addListenerOnce<Event extends EventType>(
      event: Event,
      callback: (args: Events[Event]['args']) => any,
      filters: Filter<Event>[] = []
    ): number {
      return THIS(config)._addListener(event, callback, filters, true)
    },
    async emit<Event extends RawEventType>(event: Event, args: Events[Event]['args']) {
      await THIS(config)._emit(toBeforeEvent(event), args)
      await THIS(config)._emit(event, args)
      await THIS(config)._emit(toAfterEvent(event), args)
    },
    removeListener(listenerId: number) {
      const state = state_module(config)
      state.events.listeners =
        state.events.listeners?.filter((l) => l.id !== listenerId) ?? []
    },
    _addListener<Event extends EventType>(
      event: Event,
      callback: (args: Events[Event]['args']) => any,
      filters: Filter<Event>[] = [],
      once = false
    ): number {
      const state = state_module(config)

      const listenerId = state.events.listenerId++
      state.events.listeners.push({
        id: listenerId,
        event,
        once,
        callback,
        filters,
      })
      return listenerId
    },
    async _emit<Event extends EventType>(event: Event, args: Events[Event]['args']) {
      const state = state_module(config)

      const removeIds: number[] = []
      const listeners = state.events.listeners

      let listenersTriggered = 0

      await Promise.all(
        listeners
          .filter((l) => l.event === event)
          .map(async (l) => {
            if (!(l.filters.some((f) => f(args)) || l.filters.length === 0)) return
            if (l.once) removeIds.push(l.id)

            listenersTriggered++
            await l.callback(args)
          })
      )

      emitMsg(event, args, listenersTriggered, config)
      removeIds.forEach(THIS(config).removeListener)
    },
  })
}
