import { mockAdapter, mockContractsJSON } from '@/mocks'
import { defineEvmConfig } from '@/config'

import chain from '@/modules/chain'
import events from '@/modules/events'
import store from '@/modules/store'
import wallet, { WalletHandler } from '@/modules/wallet'
import contracts from '@/modules/contracts'

import { ankrRpc } from '@/utils/chain/rpc'
import type { RemoveAbstract } from '@/utils/type'
import { MockWallet } from '@/modules/wallet/wallets/base'
import type { EvmConfig } from '@/config/type'
import type { WalletModuleConfig } from '@/modules/wallet/type'

const useEvm = defineEvmConfig({
  DEBUG: true,
  modules: {
    ...chain(ankrRpc()),
    ...events(),
    ...store({
      stores: {},
    }),
    ...contracts({
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
    }),
    ...wallet({
      wallets: {
        test: MockWallet,
      },
      options: {},
    }),
  },
  adapter: mockAdapter,
})

const { chain: c, events: e, contracts: con, config, wallet: w } = useEvm()
const { useEvents, useEventsState } = e
const { getProvider, getRpc } = c
const { useWallet } = w
const { useContracts } = con

const { token } = useContracts()
