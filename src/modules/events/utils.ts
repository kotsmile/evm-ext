import type { EvmConfig } from '../../config/type'
import { capitalize, concat, createLogger } from '../../utils'
import type { Events, EventType, RawEventType } from './type'

export const logger = createLogger('Events Module')

export const emitMsg = <Event extends EventType>(
  event: Event,
  args: Events[Event]['args'],
  amount: number
) => logger.info(`Emit ${event} x${amount}`)

export const toBeforeEvent = <E extends RawEventType>(event: E) =>
  concat('before', capitalize(event))
export const toAfterEvent = <E extends RawEventType>(event: E) =>
  concat('after', capitalize(event))
