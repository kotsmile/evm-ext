import { mockAdapter } from '@/mocks'
import { defineEvmConfig } from '@/config'

import chain from '@/modules/chain'
import events from '@/modules/events'
import store from '@/modules/store'

import { ankrRpc } from '@/utils/chain/rpc'

const useEvm = defineEvmConfig({
  DEBUG: true,
  modules: {
    chain: chain(ankrRpc()),
    events,
    store: store({
      stores: {},
    }),
  },
  adapter: mockAdapter,
})

const { config, init, chain: c, events: e } = useEvm()
const { useEvents, useEventsState } = e
