import { main as contracts } from './contracts'
import { main as chain } from './chain'
import { main as events } from './events'
import { main as store } from './store'
import { main as state } from './state'
import { main as wallet } from './wallet'

import type { Module } from '@/config/type'

export default {
  contracts,
  events,
  chain,
  store,
  state,
  wallet,
} satisfies Record<string, Module>
