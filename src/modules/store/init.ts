import type { EvmConfig } from '../../config/type'
import { entries } from '../../utils'

import { useEvents_config } from '../events/event.state'

import { storeLifecycles } from './type'
import { logger, onLifecycle } from './utils'

export const init = async (config: EvmConfig) => {}
