import type { EvmConfig } from '../../config/type'
import { log } from './utils'
export const init = async (config: EvmConfig) => {
  log('Initiated', config)
}
