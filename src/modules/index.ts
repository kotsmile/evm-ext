import contracts from './contracts'
import chain from './chain'
import events from './events'
import store from './store'
import state from './state'
import wallet from './wallet'

import type { Module } from '@/config/type'

export default {
  contracts,
  events,
  chain,
  store,
  state,
  wallet,
} satisfies Record<string, Module>
