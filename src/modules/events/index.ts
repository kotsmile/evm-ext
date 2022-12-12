import type { EvmConfig } from '../../config/type'

import { useEvents_config } from './event.state'

export default (config: EvmConfig) => {
  return {
    useEvents: useEvents_config(config),
  }
}

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
export { init } from './init'
