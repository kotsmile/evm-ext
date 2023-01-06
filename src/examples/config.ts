import { mockAdapter } from '@/mocks'
import { defineEvmConfig } from '@/config'

import chain from '@/modules/chain'
import { ankrRpc } from '@/utils/chain/rpc'

const useEvm = defineEvmConfig({
  DEBUG: true,
  modules: [
    chain({
      rpc: ankrRpc(),
    }),
  ],
  adapter: mockAdapter,
})

const { config, getProvider, getRpc, init } = useEvm()
