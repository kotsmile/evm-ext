import type { EvmConfig } from '../../config/type'

import state_module from '../state'
import { logger } from './utils'

export const init = async (config: EvmConfig) => {
  const state = state_module(config)

  // initiate state
  state.wallet.chainId = state.wallet.DEFAULT_CHAINID = config.DEFAULT_CHAINID
  state.wallet.chainIds = config.chainIds

  logger.info('Initiated')
}
