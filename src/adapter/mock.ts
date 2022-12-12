import type { adapter } from '..'
import { wrap } from '../utils'

export const mockAdapter: adapter.Adapter = () => ({
  state: {
    events: {
      listenerId: 1,
      listeners: [],
    },
    wallet: {
      chainId: '1',
      chainIds: ['1'],
      DEFAULT_CHAINID: '1',
      realChainId: '1',
      signer: wrap(null),
      walletHandler: wrap(null),
      login: false,
      loading: false,
      wallet: '0xSomeAddress',
      walletType: null,
    },
  },
})
