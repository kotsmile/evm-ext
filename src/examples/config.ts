import { mockAdapter, MockContract, mockContractsJSON } from '@/mocks'

import { defineEvmConfig } from '@/config'
import { defaultModules } from '@/modules'

import { ankrRpc, typeOf } from '@/utils'

import { MockWallet } from '@/modules/wallet'

const useEvm = defineEvmConfig({
  DEBUG: true,
  modules: {
    ...defaultModules({
      chain: ankrRpc(),
      contracts: {
        contractsJSON: mockContractsJSON,
        chainIds: ['56'],
        DEFAULT_CHAINID: '56',
        contracts: {
          shared: {
            token: {
              name: 'Vesting',
              type: typeOf<MockContract>(),
              withAddress: true,
            },
          },
          on: {},
        },
      },
      wallet: {
        wallets: {
          test: MockWallet,
        },
        options: {},
      },
      store: {
        stores: {},
      },
    }),
  },
  adapter: mockAdapter,
})

const { chain: c, events: e, contracts: con, config, wallet: w } = useEvm()
const { useEvents, useEventsState } = e
const { getProvider, getRpc } = c
const { useWallet } = w
const { useContracts } = con

const {} = useContracts()
useWallet().connect('test')
