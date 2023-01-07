import { mockAdapter, mockContractsJSON } from '@/mocks'
import { defineEvmConfig } from '@/config'

import chain from '@/modules/chain'
import events from '@/modules/events'
import store from '@/modules/store'
import wallet from '@/modules/wallet'
import contracts from '@/modules/contracts'

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
      },
    },
    on: {},
  },
  modules: {
    [chain.name]: chain.setup(ankrRpc()),
    [events.name]: events.setup({}),
    [store.name]: store.setup({
      stores: {},
    }),
    [contracts.name]: contracts.setup({}),
    [wallet.name]: wallet.setup({
      wallets: {
        test: {} as any,
      },
      options: {},
    }),
  },
  adapter: mockAdapter,
})

const { chain: c, events: e, wallet: w, contracts: con, config } = useEvm()
const { useEvents, useEventsState } = e
const { getProvider, getRpc } = c
const { useWallet } = w
const { useContracts } = con

const {} = useContracts()
useWallet().connect('test')
