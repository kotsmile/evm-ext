import type { EvmConfig } from '../../config/type'

import state_module from '../state'
import { logger } from './utils'

export const init = async (config: EvmConfig) => {
  const state = state_module(config)

  // initiate state
  state.events.listenerId = 1
  state.events.listeners = []

  logger.info('Initiated')
}
