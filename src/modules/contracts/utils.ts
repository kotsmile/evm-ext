import { generateLog } from '../../utils'

export const contractType = <C>(): C => ({} as C)

export const { log, error, warn } = generateLog('[Contracts Module]', '#CCCC11')
