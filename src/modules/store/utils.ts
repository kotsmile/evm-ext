import { capitalize, concat, generateLog } from '../../utils'
import type { StoreLifecycle } from './type'

export const onLifecycle = <L extends StoreLifecycle>(l: L) => concat('on', capitalize(l))

export const { log, warn, error } = generateLog('[Store Module]', '#AA0099')
