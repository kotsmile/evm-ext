import { capitalize, concat, createLogger } from '../../utils'
import type { StoreLifecycle } from './type'

export const onLifecycle = <L extends StoreLifecycle>(l: L) => concat('on', capitalize(l))

export const logger = createLogger('Store Module')
