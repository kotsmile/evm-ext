import type { EvmConfig } from '../../config/type'
import { logger } from './utils'
export const init = async (config: EvmConfig) => {
  logger.info('Initiated')
}
