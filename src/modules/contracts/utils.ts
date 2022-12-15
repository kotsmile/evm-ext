import { createLogger } from '../../utils'

export const contractType = <C>(): C => ({} as C)

export const logger = createLogger('Contracts Module')
