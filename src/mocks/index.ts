import type { BaseContract } from 'ethers'
import type { adapter } from '..'
import type { ContractsJSONStruct } from '../modules/contracts'
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

export const mockContractsJSON = {
  '1': [
    {
      chainId: '1',
      name: 'eth_mainnet',
      contracts: {
        Token: {
          address: '0xTokenAddress',
          abi: [],
        },
        Staking: {
          address: '0xStakingAddress',
          abi: [],
        },
      },
    },
  ],
  '56': [
    {
      chainId: '56',
      name: 'bsc_mainnet',
      contracts: {
        Token: {
          address: '0xTokenAddress',
          abi: [],
        },
        Vesting: {
          address: '0xVestingAddress',
          abi: [],
        },
      },
    },
  ],
} satisfies ContractsJSONStruct

export interface MockContract extends BaseContract {}
