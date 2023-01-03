import type { BaseContract } from 'ethers'

import type { adapter } from '@/index'
import type { ContractsJSONStruct } from '@/modules/contracts'
import type { State } from '@/modules/state'
import type { ToolsFunction } from '@/config/type'

import { wrapState } from '@/utils'

export const mockState = (): State => ({
  events: {
    listenerId: 1,
    listeners: [],
  },
  wallet: {
    chainId: '1',
    chainIds: ['1'],
    DEFAULT_CHAINID: '1',
    realChainId: '1',
    signer: wrapState(null),
    walletHandler: wrapState(null),
    login: false,
    loading: false,
    wallet: '0xSomeAddress',
    walletType: null,
  },
})

export const mockTools = ((config) => ({
  helloTool: () => console.log('hello world'),
  printConfig: () => console.log(config),
})) satisfies ToolsFunction

export const mockAdapter = {
  state: mockState,
  tools: mockTools,
} satisfies adapter.AdapterDefinition

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

export interface MockContract extends BaseContract {
  _mock: 'hello'
}
