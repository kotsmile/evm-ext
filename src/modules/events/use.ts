import type { EvmContext } from '@/core/type'

import type { Events, EventType, Filter, RawEventType } from './type'
import { emitMsg, toAfterEvent, toBeforeEvent } from './utils'
import { useEventsState } from './state'

export const useEvents_ctx = (ctx: EvmContext) => {
  return {
    addListener<Event extends EventType>(
      event: Event,
      callback: (args: Events[Event]['args']) => any,
      filters: Filter<Event>[] = []
    ): number {
      return this._addListener(event, callback, filters)
    },
    addListenerOnce<Event extends EventType>(
      event: Event,
      callback: (args: Events[Event]['args']) => any,
      filters: Filter<Event>[] = []
    ): number {
      return this._addListener(event, callback, filters, true)
    },
    async emit<Event extends RawEventType>(event: Event, args: Events[Event]['args']) {
      await this._emit(toBeforeEvent(event), args)
      await this._emit(event, args)
      await this._emit(toAfterEvent(event), args)
    },
    removeListener(listenerId: number) {
      const eventsState = useEventsState(ctx)
      eventsState.listeners =
        eventsState.listeners?.filter((l) => l.id !== listenerId) ?? []
    },
    _addListener<Event extends EventType>(
      event: Event,
      callback: (args: Events[Event]['args']) => any,
      filters: Filter<Event>[] = [],
      once = false
    ): number {
      const eventsState = useEventsState(ctx)

      const listenerId = eventsState.listenerId++
      eventsState.listeners.push({
        id: listenerId,
        event,
        once,
        callback,
        filters,
      })
      return listenerId
    },
    async _emit<Event extends EventType>(event: Event, args: Events[Event]['args']) {
      const eventsState = useEventsState(ctx)

      const removeIds: number[] = []
      const listeners = eventsState.listeners

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
      removeIds.forEach(this.removeListener)
    },
  }
}
