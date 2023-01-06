import { mockAdapter, mockContractsJSON } from '@/mocks'
import { defineEvmConfig } from '@/config'

import chain from '@/modules/chain'
import events from '@/modules/events'
import store from '@/modules/store'

import { ankrRpc } from '@/utils/chain/rpc'

const useEvm = defineEvmConfig({
  DEBUG: true,
  contractsJSON: mockContractsJSON,
  chainIds: ['56'],
  DEFAULT_CHAINID: '56',
  contracts: {
    shared: {
      token: {
        name: 'Vesting',
        withAddress: true,
      },
    },
    on: {},
  },
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
