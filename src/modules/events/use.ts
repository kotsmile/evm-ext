import type { EvmConfig } from '@/config/type'
import type { Events, EventType, Filter, RawEventType } from '@/modules/events/type'
import { emitMsg, toAfterEvent, toBeforeEvent } from '@/modules/events/utils'

import { useState } from '@/modules/state'

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
      const state = useState(config)
      state.events.listeners =
        state.events.listeners?.filter((l) => l.id !== listenerId) ?? []
    },
    _addListener<Event extends EventType>(
      event: Event,
      callback: (args: Events[Event]['args']) => any,
      filters: Filter<Event>[] = [],
      once = false
    ): number {
      const state = useState(config)

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
      const state = useState(config)

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

      emitMsg(event, args, listenersTriggered)
      removeIds.forEach(THIS(config).removeListener)
    },
  })
}
